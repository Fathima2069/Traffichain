// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract TrafficChain {
    struct Violation {
        uint id;
        string vehicleNumber;
        string rule;
        uint fineAmount;
        bool paid;
    }

    uint public nextId;
    mapping(uint => Violation) public violations;
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    function addViolation(string memory vehicleNumber, string memory rule, uint fineAmount) public {
        require(msg.sender == admin, "Only admin can add violation");
        violations[nextId] = Violation(nextId, vehicleNumber, rule, fineAmount, false);
        nextId++;
    }

    function payFine(uint id) public payable {
        Violation storage v = violations[id];
        require(!v.paid, "Already paid");
        require(msg.value == v.fineAmount, "Incorrect amount");
        v.paid = true;
        payable(admin).transfer(msg.value);
    }

    function getViolation(uint id) public view returns (Violation memory) {
        return violations[id];
    }
}
