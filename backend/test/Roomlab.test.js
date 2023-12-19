const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect, assert } = require("chai");

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
    })

})