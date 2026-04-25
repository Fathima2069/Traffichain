// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ViolationRegistry {

    struct Violation {
        string vehicleNumber;
        string violationType;
        uint256 fine;
        uint256 timestamp;
    }

    Violation[] public violations;

    function addViolation(
        string memory _vehicleNumber,
        string memory _violationType,
        uint256 _fine
    ) public {
        violations.push(
            Violation(
                _vehicleNumber,
                _violationType,
                _fine,
                block.timestamp
            )
        );
    }

    function getViolationsCount() public view returns (uint256) {
        return violations.length;
    }
}
