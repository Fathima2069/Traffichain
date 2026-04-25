// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TrafficPenalty {

    struct Violation {
        uint id;
        string vehicleNumber;
        string violationType;
        uint fineAmount;
        bool paid;
    }

    uint public violationCount = 0;

    mapping(uint => Violation) public violations;

    event ViolationAdded(uint id, string vehicleNumber, uint fineAmount);
    event FinePaid(uint id);

    function addViolation(
        string memory _vehicleNumber,
        string memory _violationType,
        uint _fineAmount
    ) public {

        violationCount++;

        violations[violationCount] = Violation(
            violationCount,
            _vehicleNumber,
            _violationType,
            _fineAmount,
            false
        );

        emit ViolationAdded(violationCount, _vehicleNumber, _fineAmount);
    }

    function payFine(uint _id) public payable {
        Violation storage v = violations[_id];

        require(!v.paid, "Already paid");
        require(msg.value == v.fineAmount, "Incorrect amount");

        v.paid = true;

        emit FinePaid(_id);
    }

    function getViolation(uint _id) public view returns (Violation memory) {
        return violations[_id];
    }
}
