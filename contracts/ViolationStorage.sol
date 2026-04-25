// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ViolationStorage {

    struct Violation {
        string vehicleNumber;
        string violationType;
        uint amount;
        uint timestamp;
    }

    Violation[] public violations;

    function addViolation(
        string memory _vehicleNumber,
        string memory _violationType,
        uint _amount
    ) public {

        violations.push(
            Violation(
                _vehicleNumber,
                _violationType,
                _amount,
                block.timestamp
            )
        );
    }

    function getViolation(uint index) public view returns (
        string memory,
        string memory,
        uint,
        uint
    ) {
        Violation memory v = violations[index];
        return (
            v.vehicleNumber,
            v.violationType,
            v.amount,
            v.timestamp
        );
    }
}