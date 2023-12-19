const hre = require("hardhat");

async function main() {

  const roomlab = await hre.ethers.deployContract("RoomLab");

  await roomlab.waitForDeployment();

  console.log(`RoomLab contract is deployed to ${roomlab.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
