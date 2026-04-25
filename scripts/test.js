async function main() {
  // Get accounts
  const [owner, user] = await ethers.getSigners();

  // Attach to deployed contract
  const TrafficPenalty = await ethers.getContractFactory("TrafficPenalty");
  const trafficPenalty = await TrafficPenalty.attach("  0x5FbDB2315678afecb367f032d93F642f64180aa3"); // replace with your deployed address

  console.log("Owner:", owner.address);
  console.log("User:", user.address);

  // Add a violation (only once!)
  let tx = await trafficPenalty.addViolation("KL01AA1234", "No helmet", 500, user.address);
  await tx.wait();
  console.log("Violation added");

  // Check number of violations
  let count = await trafficPenalty.violationCount();
  console.log("Violations:", count.toString());
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
