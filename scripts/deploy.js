async function main() {
  const TrafficPenalty = await ethers.getContractFactory("TrafficPenalty");
  const contract = await TrafficPenalty.deploy();

  await contract.deployed();

  console.log("Contract deployed to:", contract.address);
}

main();
