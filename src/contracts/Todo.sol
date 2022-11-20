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

    function getTodos() public view returns (Task[] memory) {
        return list[msg.sender];
    }

    function deleteTodo(uint _id) public {
        uint n = list[msg.sender].length;
        require(_id < n, "Please enter a valid id");
        for (uint i = _id; i < n - 1; i++) {
            list[msg.sender][i] = list[msg.sender][i + 1];
        }
        list[msg.sender].pop();
    }
}
