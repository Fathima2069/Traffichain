// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TrafficPenalty {

    address public owner;

    struct Penalty {
        string vehicleNumber;
        uint amount;
        bool paid;
    }

    mapping(uint => Penalty) public penalties;
    uint public penaltyCount;

    constructor() {
        owner = msg.sender;
    }

    function addPenalty(string memory _vehicle, uint _amount) public {
        penaltyCount++;
        penalties[penaltyCount] = Penalty(_vehicle, _amount, false);
    }

    function payPenalty(uint _id) public payable {
        require(msg.value == penalties[_id].amount, "Wrong amount");
        penalties[_id].paid = true;
    }

    function getPenalty(uint _id) public view returns(string memory,uint,bool){
        Penalty memory p = penalties[_id];
        return(p.vehicleNumber,p.amount,p.paid);
    }
}
