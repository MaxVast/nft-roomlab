// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

error CannotBuyYet();
error MaxSupplyExceeded();
error NotEnoughtFunds();
error CannotMintMoreThanThreeNft();
error NftNotMinted();
error UserHasNoToken();

/// @title A contract for mint NFTs "Room Lab"
/// @author MaxVast
/// @dev Implementation Openzeppelin Ownable, Strings, ERC721, ERC721Enumerable
contract RoomLab is ERC721, ERC721Enumerable, Ownable {

    using Strings for uint;

    //Amount NFTs/Wallet
    uint8 private constant MAX_PER_ADDRESS_DURING_PUBLIC = 3;
    //The total number of NFTs
    uint16 private constant MAX_SUPPLY = 300;
    //When the sale starts
    uint32 public saleStartTime = 1683880200;
    //The price of one NFT
    uint64 private constant PRICE_PUBLIC = 0.1 ether;
    //base URI of the NFTs
    string baseURI;
    /// @notice Mapping from User Address to uint, amount NFT per Wallet User
    mapping(address => uint8) amountNFTsperWalletPublic;

    /// @notice Emitted when tokens is gifted.
    /// @dev If a token is gifted, this event should be emitted.
    /// @param user The address of the user claiming the token.
    event TokenGifted(address indexed user);

    /// @notice Emitted when tokens is claimed.
    /// @dev If a token is claimed, this event should be emitted.
    /// @param user The address of the user claiming the token.
    /// @param tokenID The tokenID of the token claiming.
    event TokenClaimed(address indexed user, uint256 indexed tokenID);
    
    /// @dev Constructor to initialize the ERC721 token with a name and symbol.
    constructor() ERC721("Room Lab", "RLAB") Ownable(msg.sender) {}

    /// @notice Mint function
    function mint() external payable {
        if(currentTime() < saleStartTime) {
            revert CannotBuyYet();
        }

        if(amountNFTsperWalletPublic[msg.sender] + 1 > MAX_PER_ADDRESS_DURING_PUBLIC) {
            revert CannotMintMoreThanThreeNft();
        }

        if (msg.value < PRICE_PUBLIC * 1) {
            revert NotEnoughtFunds();
        }

        if(totalSupply() + 1 > MAX_SUPPLY) {
            revert MaxSupplyExceeded();
        }

        amountNFTsperWalletPublic[msg.sender] += 1;

        _safeMint(msg.sender, totalSupply() + 1);

         emit TokenClaimed(msg.sender, totalSupply());

        refundIfOver(PRICE_PUBLIC * 1);
    }

    /// @notice Gift a amount of NFTs at address
    /// @param _account Address
    /// @param _quantity uint
    function gift(address _account, uint16 _quantity) external onlyOwner {
        if(totalSupply() + _quantity > MAX_SUPPLY) {
            revert MaxSupplyExceeded();
        }

        for(uint i = 1; i <= _quantity; i++) {
             _safeMint(_account, totalSupply() + 1);
        }

        emit TokenGifted(_account);
    }

    /// @notice Refund Price Nft * quantity
    /// @param _price uint256
    function refundIfOver(uint _price) internal {
        if (msg.value > _price) {
            payable(msg.sender).transfer(msg.value - _price);
        }
    }

    /// @notice List tokenId NFTs by address
    /// @param _account Address user
    /// @return Array of TokenId belonging to a user
    function listTokenIdbyAddress(address _account) external view returns(uint[] memory) {
        if(balanceOf(_account) == 0) {
            revert UserHasNoToken();
        }
        uint numberNft = balanceOf(_account);
        uint[] memory listTokenId = new uint[](numberNft);

        for(uint i = 0; i < numberNft; i++) {
            listTokenId[i] = tokenOfOwnerByIndex(_account, i);
        }

        return listTokenId;
    }

    /// @notice Change the baseURI
    /// @param _baseUri The new base URI of the NFTs
    function setBaseURI(string calldata _baseUri) external onlyOwner {
        baseURI = _baseUri;
    }

    /// @notice return the baseURI
    function getBaseURI() external view returns (string memory) {
        return _baseURI();
    }

    /// @notice Change the saleStartTime
    /// @param _saleStartTime The new saleStartTime
    function setSaleStartTime(uint32 _saleStartTime) external onlyOwner {
        saleStartTime = _saleStartTime;
    }

    /// @notice Get the base URI
    /// @return baseUri as a string
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    /// @notice Get the current timestamp
    /// @return the current timestamp
    function currentTime() internal view returns(uint) {
        return block.timestamp;
    }

    /// @notice Transfers the ETH balance from the Smart contract 
    /// @dev This function allows you to transfer the ETH balance from the smart contract and distribute 3% to an address
    function withdraw() external payable onlyOwner {
        // This will pay 3% of the initial sal to support
        // You can remove this if you want
        (bool hs, ) = payable(0xe79B2cc4c07dB560f8e1eE63ed407DD2DCFdE80e).call{value: address(this).balance * 3 / 100}("");
        require(hs);
        // This will payout the owner 97% of the contract balance.
        (bool os, ) = payable(owner()).call{value: address(this).balance}("");
        require(os);
    }

    // The following functions are overrides required by Solidity.
    ///@notice Get the token URI of an NFT by his ID
    /// @param _tokenId The ID of the NFT you want to have the URI
    /// @return String tokenURI 
    function tokenURI(uint _tokenId) public view virtual override(ERC721) returns(string memory) {
        require(ownerOf(_tokenId) != address(0));

        return string(abi.encodePacked(baseURI, _tokenId.toString(), ".json"));
    }

    function _update(address to, uint256 tokenId, address auth) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
