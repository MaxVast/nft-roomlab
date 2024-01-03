const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("Room Lab Contract", function () {
    let owner, user, user2, user3;
    let roomlabContract;

    async function deployFixture() {
        [owner, user, user2, user3] = await ethers.getSigners();

        const RoomLabContract = await ethers.getContractFactory("RoomLab");
        roomlabContract = await RoomLabContract.deploy();

        return { roomlabContract, owner, user, user2, user3 }
    }

    describe("Check Deploy Smart Contract", () => {
        beforeEach(async function () {
            const roomlabContract = await loadFixture(deployFixture);
        });

        it("Check owner Smart Contract", async function () {
            assert.equal(await roomlabContract.owner(), owner.address)
        });

        it("Check name and symbol token", async function () {
            assert.equal(await roomlabContract.name(), "Room Lab")
            assert.equal(await roomlabContract.symbol(), "RLAB")
        });
    })

    describe("Check init value contract token NFT", () => {
        beforeEach(async function () {
            const roomlabContract = await loadFixture(deployFixture);
        });

        it("should not set baseURI if you are not the Owner", async function () {
            await expect(roomlabContract.connect(user).setBaseURI("ipfs://bafybeiacjnyyw73lghuleuqcgctpqfsefse2tfrrryrcihkzkxtia/"))
                .to.be.revertedWithCustomError(roomlabContract, "OwnableUnauthorizedAccount")
                .withArgs(user.address);
        });

        it("should set baseURI", async function () {
            const baseURI = "ipfs://bafybeiacjnyyw73lghuleuqcgctpqwer3oety3lu2tfrrryrcihkzkxtia/"
            await roomlabContract.setBaseURI(baseURI)

            assert.equal(await roomlabContract.baseURI(), baseURI)
        });

        it("should not set saleStartTime if you are not the Owner", async function () {
            const timeStamp = 1704300711;
            await expect(roomlabContract.connect(user).setSaleStartTime(timeStamp))
                .to.be.revertedWithCustomError(roomlabContract, "OwnableUnauthorizedAccount")
                .withArgs(user.address);
        });

        it("should set saleStartTime", async function () {
            const timeStamp = 1704300711;
            await roomlabContract.setSaleStartTime(timeStamp)

            assert.equal(await roomlabContract.saleStartTime(), timeStamp)
        });
    })

    describe("Check gift NFT", () => {
        beforeEach(async function () {
            const roomlabContract = await loadFixture(deployFixture);
        });

        it("should not gift tokens if you are not the Owner", async function () {
            await expect(roomlabContract.connect(user).gift(user.address, 2))
                .to.be.revertedWithCustomError(roomlabContract, "OwnableUnauthorizedAccount")
                .withArgs(user.address);
        });

        it("should revert if the total supply exceeds the maximum supply", async function () {
            const _quantity = 300;
            // Mint 10 NFTs to reach the maximum supply
            await roomlabContract.gift(user.address, _quantity);
            // Attempt to gift one more NFT, expecting a revert
            await expect(roomlabContract.gift(user2.address, 2))
                .to.be.revertedWithCustomError(roomlabContract, "MaxSupplyExceeded");
          });
        

        it("should gift tokens", async function () {
            const _quantity = 2;
            // Mint a token
            await expect(roomlabContract.gift(user.address, _quantity))
                .to.emit(roomlabContract, 'TokenGifted')
                .withArgs(user.address);
            // Assertions
            assert.equal(await roomlabContract.balanceOf(user.address), _quantity);
            assert.equal(await roomlabContract.totalSupply(), _quantity);
        });
    })

    describe("Check Mint NFT", () => {
        beforeEach(async function () {
            const roomlabContract = await loadFixture(deployFixture);
        });

        // Test case for minting before the sale start time
        it("should revert if trying to mint before the sale start time", async function () {
            const PRICE_PUBLIC = ethers.parseEther("0.1");
            await roomlabContract.setSaleStartTime(1735685999)//31/12/2024 23:59:59

            await expect(roomlabContract.connect(user).mint({ value: PRICE_PUBLIC }))
                .to.be.revertedWithCustomError(roomlabContract, "CannotBuyYet");
        });

        it("should revert if trying to mint with insufficient funds", async function () {
            const PRICE_PUBLIC = ethers.parseEther("0.09");
            await expect(roomlabContract.connect(user).mint({ value: PRICE_PUBLIC}))
                .to.be.revertedWithCustomError(roomlabContract, "NotEnoughtFunds");
        });

        it("should successfully mint NFTs for the user", async function () {
            const PRICE_PUBLIC = ethers.parseEther("0.1");
            // Mint NFT for the user
            await roomlabContract.connect(user).mint({ value: PRICE_PUBLIC });
            // Check the total supply after minting
            const totalSupplyAfterMint = await roomlabContract.totalSupply();
            assert.equal(totalSupplyAfterMint, 1)
            // Check the owner of the minted NFT
            const ownerOfNFT = await roomlabContract.ownerOf(1);
            assert.equal(ownerOfNFT, user.address)
        });

        it("should refund excess funds if more funds are sent than required", async function () {
            //Get initial Balance User
            const initialBalance = await ethers.provider.getBalance(user.address);
            // Price over for 1 NFT
            const PRICE_PUBLIC_MORE = ethers.parseEther("0.3");
            // Price Public Sale
            const PRICE_PUBLIC = ethers.parseEther("0.1");
            // Mint 1 NFT for the user, sending excess funds
            const mintTx = await roomlabContract.connect(user).mint({ value: PRICE_PUBLIC_MORE });
            // Get the gas used from the transaction receipt
            const receipt = await ethers.provider.getTransactionReceipt(mintTx.hash);
            const gasUsed = receipt.gasUsed;
            //Get final Balance User after refund if over
            const finalBalance = await ethers.provider.getBalance(user.address);
            //Check final balance with initial less price public, less gas used for the transaction
            assert.equal(finalBalance, initialBalance - PRICE_PUBLIC - gasUsed)
        });
    })

})