# Room Lab NFT
<!-- #### Lien Déploiement Vercel: [LINK  ](#) <br/>
#### Déployé sur sépolia : <br/>
[RoomLab](#)<br/> -->

Developpé et déployé par :  
Maxence VAST : 0xe79B2cc4c07dB560f8e1eE63ed407DD2DCFdE80e

<!--## Détails-->

### Contract

This smart contract is a Solidity-based Ethereum platform contract for the creation and management of ERC-721 and ERC-721 Enumerable compliant non-fungible tokens (NFTs).

Here is a summary of its main features:

#### 1. Parameters and Constants :
- **MAX_PER_ADDRESS_DURING_PUBLIC:** The maximum number of NFTs an address can purchase during the public sale.<br/>
- **MAX_SUPPLY:** The maximum total number of NFTs that can be created.<br/>
- **saleStartTime:** The moment when the public sale begins, in Unix timestamp format.<br/>
- **PRICE_PUBLIC:** The price of one NFT during the public sale, in ETH. (0.1 ETH)<br/>
- **baseURI:** The base URI for NFT metadata.<br/>

#### 2. Events :
- **TokenGifted:** Triggered when an NFT is gifted to an address.<br/>
- **TokenClaimed:** Triggered when an NFT is claimed by a user.<br/>

#### 3. Minting Function (mint):
Users can purchase NFTs by calling the mint function.
Checks are performed to ensure conditions are met, including the sale period, the maximum number of purchases per address, the amount of funds sent, and the total number of available NFTs.
If all conditions are met, a new NFT is created and assigned to the buyer's address.

#### 4. Gifting Function (gift):
The contract owner can gift NFTs to a specific address.
Checks are performed to ensure that the total number of NFTs after the operation remains less than or equal to the maximum limit.

#### 5. Other Features:
- **refundIfOver:** Refunds a portion of the funds sent if the user has paid more than the cost of the NFT.
- **listTokenIdbyAddress:** Returns a list of token IDs held by a specific address.
- **setBaseURI:** Allows the owner to change the base URI of metadata.
- **setSaleStartTime:** Allows the owner to change the sale start time.
- **withdraw:** Allows the owner to withdraw funds from the contract, redistributing a portion to a specific address (3%) and the rest to the owner.


This is essentially an NFT contract with sale, gifting, and fund management mechanisms. The created NFTs follow the ERC-721 standard and can be claimed, gifted, and listed by owners.

### Test
24 tests.
24 passing (5s)

File          |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
--------------|----------|----------|----------|----------|----------------|
 contracts/   |    96.67 |    92.86 |    93.33 |     97.5 |                |
  Roomlab.sol |    96.67 |    92.86 |    93.33 |     97.5 |            174 |
--------------|----------|----------|----------|----------|----------------|
All files     |    96.67 |    92.86 |    93.33 |     97.5 |                |
--------------|----------|----------|----------|----------|----------------|

Uncovered line 174 is a mandatory implementation function (_increaseBalance()) for the smart contract, but it is not modified or used.


### Front
The list of the stack used for the Front :
- Rainbow Kit
- Wagmi
- Viem
- NextJs
- Tailwind CSS
  <br/><br/>

### Back-end/Smart Contract
The list of the stack used for the Smart Contract part :
- Hardhat
- ERC721
- Librairie OpenZeppelin

### Support and Contributions
If you find this project useful and would like to support its development, consider making a contribution or sending a tip to 0xe79B2cc4c07dB560f8e1eE63ed407DD2DCFdE80e
