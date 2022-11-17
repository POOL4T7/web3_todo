// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Todo {
    uint public taskCount = 0;
    struct Task {
        uint id;
        string message;
        bool isDone;
    }
    mapping(address => Task[]) list;

    function addTodo(string memory _message) public {
        list[msg.sender].push(Task(taskCount++, _message, false));
    }

    function updateTodo(uint _id, string memory _message) public {
        list[msg.sender][_id].message = _message;
    }

    function updateStatus(uint _id, bool _status) public {
        list[msg.sender][_id].isDone = _status;
    }

    function getTodos() public returns (Task[] memory) {
        return list[msg.sender];
    }
}