const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TrafficPenalty Contract", function () {
  it("Should add and get penalty", async function () {
    const TrafficPenalty = await ethers.getContractFactory("TrafficPenalty");
    const contract = await TrafficPenalty.deploy();
    await contract.deployed();

    await contract.addPenalty("ABC123", 100);
    const penalty = await contract.getPenalty("ABC123");

    expect(penalty).to.equal(100);
  });
});
