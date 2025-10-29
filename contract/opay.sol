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

function setActive(address[] calldata _emps) external {
    // Step 1: Deactivate all employees first
    for (uint256 i = 0; i < employeeList.length; i++) {
        address empAddr = employeeList[i];
        if (employees[empAddr].activeToday) {
            employees[empAddr].activeToday = false;
            emit EmployeeStatusUpdated(empAddr, false);
        }
    }

    // Step 2: Activate only the provided ones
    for (uint256 i = 0; i < _emps.length; i++) {
        address empAddr = _emps[i];
        require(employees[empAddr].exists, "Employee not found");
        employees[empAddr].activeToday = true;
        emit EmployeeStatusUpdated(empAddr, true);
    }
}


    // ----------------------------
    //  Lottery logic
    // ----------------------------
function runLottery() external returns (address winner) {
    // ----------------------------
    //  Prevent multiple draws per day (Nepal time)
    // ----------------------------
    uint256 currentDay = (block.timestamp + 20700) / 86400; // Nepal UTC+5:45
    require(currentDay != lastDrawBlock, "Already drawn today");

    // Pause on weekends (Nepal time)
    uint8 dayOfWeek = uint8((currentDay + 4) % 7); // 0 = Sunday, 6 = Saturday
    require(dayOfWeek != 6 && dayOfWeek != 0, "Lottery paused on weekends");

    // ----------------------------
    //  Get random number from Chainlink RNG
    // ----------------------------
    uint256 random = rngContract.getRandomNumber();

    // ----------------------------
    //  Calculate total weight (sum of all active employees)
    // ----------------------------
    uint256 totalWeight = 0;
    for (uint256 i = 0; i < employeeList.length; i++) {
        Employee storage emp = employees[employeeList[i]];
        if (!emp.activeToday) continue;
        totalWeight += emp.weight;
    }

    // Handle first draw or all-zero-weight case
    if (totalWeight == 0) {
        for (uint256 i = 0; i < employeeList.length; i++) {
            Employee storage emp = employees[employeeList[i]];
            if (emp.activeToday) {
                emp.weight = 1;
                totalWeight += 1;
            }
        }
    }

    require(totalWeight > 0, "No active employees today");

    // ----------------------------
    //  Weighted random selection
    // ----------------------------
    uint256 winningPoint = random % totalWeight;
    uint256 counter = 0;

    for (uint256 i = 0; i < employeeList.length; i++) {
        Employee storage emp = employees[employeeList[i]];
        if (!emp.activeToday || emp.weight == 0) continue;

        counter += emp.weight;
        if (winningPoint < counter) {
            // 🎯 Found the winner
            emp.weight = 0; // reset winner's weight
            emp.lastPaidDay = block.number;
            lastWinner = employeeList[i];
            lastDrawBlock = currentDay; // store current day
            emit WinnerSelected(employeeList[i], block.timestamp);
            winner = employeeList[i];
            break;
        }
    }

    // ----------------------------
    //  Increment weight for other active employees
    // ----------------------------
    for (uint256 i = 0; i < employeeList.length; i++) {
        Employee storage emp = employees[employeeList[i]];
        if (!emp.activeToday || employeeList[i] == lastWinner) continue;
        emp.weight += 1;
    }

    return winner;
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
