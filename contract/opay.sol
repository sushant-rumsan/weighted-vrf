// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

interface ISimpleRandomNumber {
    function getRandomNumber() external view returns (uint256);
}

contract OfficeBillLottery {
    struct Employee {
        string name;
        uint256 weight;      // probability weight (integer, not %)
        bool activeToday;
        bool exists;
        uint256 lastPaidDay; // block number of last payment
    }

    mapping(address => Employee) public employees;
    address[] public employeeList;
    address public moderator;
    ISimpleRandomNumber public rngContract;
    uint256 public lastDrawBlock;
    address public lastWinner;

    event EmployeeAdded(address indexed employee, string name);
    event WinnerSelected(address indexed winner, uint256 day);
    event EmployeeStatusUpdated(address indexed employee, bool active);

    modifier onlyModerator() {
        require(msg.sender == moderator, "Not moderator");
        _;
    }

    constructor(address _rngContract) {
        moderator = msg.sender;
        rngContract = ISimpleRandomNumber(_rngContract);
    }

    // ----------------------------
    //  Employee management
    // ----------------------------
    function addEmployee(address _emp, string memory _name) external onlyModerator {
        require(!employees[_emp].exists, "Already added");
        employees[_emp] = Employee({
            name: _name,
            weight: 0,
            activeToday: false,
            exists: true,
            lastPaidDay: 0
        });
        employeeList.push(_emp);
        emit EmployeeAdded(_emp, _name);
    }

    function setActive(address[] calldata _emps, bool _status) external onlyModerator {
        for (uint256 i = 0; i < _emps.length; i++) {
            address empAddr = _emps[i];
            require(employees[empAddr].exists, "Employee not found");
            employees[empAddr].activeToday = _status;
            emit EmployeeStatusUpdated(empAddr, _status);
        }
    }

    // ----------------------------
    //  Lottery logic
    // ----------------------------
    function runLottery() external returns (address winner) {
        // require(block.number > lastDrawBlock, "Already drawn today"); // commented for testing

        // Pause on weekends
        uint8 dayOfWeek = uint8((block.timestamp / 86400 + 4) % 7);
        require(dayOfWeek != 6 && dayOfWeek != 0, "Lottery paused on weekends");

        uint256 random = rngContract.getRandomNumber();

        uint256 totalWeight = 0;
        for (uint256 i = 0; i < employeeList.length; i++) {
            Employee storage emp = employees[employeeList[i]];
            if (!emp.activeToday) continue;

            if (emp.lastPaidDay == block.number - 1) {
                emp.weight = 0;
            } else {
                emp.weight += 1;
            }
            totalWeight += emp.weight;
        }

        require(totalWeight > 0, "No active employees today");

        uint256 winningPoint = random % totalWeight;
        uint256 counter = 0;

        for (uint256 i = 0; i < employeeList.length; i++) {
            Employee storage emp = employees[employeeList[i]];
            if (!emp.activeToday || emp.weight == 0) continue;

            counter += emp.weight;
            if (winningPoint < counter) {
                emp.weight = 0;
                emp.lastPaidDay = block.number;
                lastDrawBlock = block.number;
                lastWinner = employeeList[i];
                emit WinnerSelected(employeeList[i], block.timestamp);
                return employeeList[i];
            }
        }

        revert("No winner found");
    }

    // ----------------------------
    //  View functions
    // ----------------------------
    function getEmployees() external view returns (address[] memory) {
        return employeeList;
    }

    function getEmployee(address _emp) external view returns (Employee memory) {
        return employees[_emp];
    }

    function getLastWinner() external view returns (address) {
        return lastWinner;
    }

    // ✅ New helper: get names & weights together
    function getEmployeeNamesAndWeights()
        external
        view
        returns (string[] memory names, uint256[] memory weights)
    {
        uint256 length = employeeList.length;
        names = new string[](length);
        weights = new uint256[](length);

        for (uint256 i = 0; i < length; i++) {
            Employee storage emp = employees[employeeList[i]];
            names[i] = emp.name;
            weights[i] = emp.weight;
        }
    }
}
