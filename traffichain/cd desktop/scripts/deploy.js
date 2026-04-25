const hre = require("hardhat");

async function main() {
  const TrafficPenalty = await hre.ethers.getContractFactory("TrafficPenalty");
  const contract = await TrafficPenalty.deploy();

  await contract.deployed();   // ← correct for ethers v5

  console.log("Contract deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

