import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Office lottery
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const officeLotteryAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_emp', internalType: 'address', type: 'address' },
      { name: '_name', internalType: 'string', type: 'string' },
    ],
    name: 'addEmployee',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'constructor',
    inputs: [
      { name: '_rngContract', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'employee',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'EmployeeAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'employee',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'active', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'EmployeeStatusUpdated',
  },
  {
    type: 'function',
    inputs: [],
    name: 'runLottery',
    outputs: [{ name: 'winner', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_emps', internalType: 'address[]', type: 'address[]' }],
    name: 'setActive',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'winner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'day', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'WinnerSelected',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'employeeList',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'employees',
    outputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'weight', internalType: 'uint256', type: 'uint256' },
      { name: 'activeToday', internalType: 'bool', type: 'bool' },
      { name: 'exists', internalType: 'bool', type: 'bool' },
      { name: 'lastPaidDay', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_emp', internalType: 'address', type: 'address' }],
    name: 'getEmployee',
    outputs: [
      {
        name: '',
        internalType: 'struct OfficeBillLottery.Employee',
        type: 'tuple',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'weight', internalType: 'uint256', type: 'uint256' },
          { name: 'activeToday', internalType: 'bool', type: 'bool' },
          { name: 'exists', internalType: 'bool', type: 'bool' },
          { name: 'lastPaidDay', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getEmployeeNamesAndWeights',
    outputs: [
      { name: 'names', internalType: 'string[]', type: 'string[]' },
      { name: 'weights', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getEmployees',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLastWinner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lastDrawBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lastWinner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'moderator',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rngContract',
    outputs: [
      {
        name: '',
        internalType: 'contract ISimpleRandomNumber',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Random number generator
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const randomNumberGeneratorAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_subscriptionId', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [
      { name: 'have', internalType: 'address', type: 'address' },
      { name: 'want', internalType: 'address', type: 'address' },
    ],
    name: 'OnlyCoordinatorCanFulfill',
  },
  {
    type: 'error',
    inputs: [
      { name: 'have', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'coordinator', internalType: 'address', type: 'address' },
    ],
    name: 'OnlyOwnerOrCoordinator',
  },
  { type: 'error', inputs: [], name: 'ZeroAddress' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'vrfCoordinator',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'CoordinatorSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'randomNumber',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RandomNumberGenerated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'requestId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RandomNumberRequested',
  },
  {
    type: 'function',
    inputs: [],
    name: 'CALLBACK_GAS_LIMIT',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'KEY_HASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'NUM_WORDS',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'REQUEST_CONFIRMATIONS',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'VRF_COORDINATOR',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRandomNumber',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'randomResult',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'requestId', internalType: 'uint256', type: 'uint256' },
      { name: 'randomWords', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'rawFulfillRandomWords',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'requestRandomNumber',
    outputs: [{ name: 'requestId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 's_vrfCoordinator',
    outputs: [
      {
        name: '',
        internalType: 'contract IVRFCoordinatorV2Plus',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_vrfCoordinator', internalType: 'address', type: 'address' },
    ],
    name: 'setCoordinator',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'subscriptionId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'to', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link officeLotteryAbi}__
 */
export const useReadOfficeLottery = /*#__PURE__*/ createUseReadContract({
  abi: officeLotteryAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link officeLotteryAbi}__ and `functionName` set to `"employeeList"`
 */
export const useReadOfficeLotteryEmployeeList =
  /*#__PURE__*/ createUseReadContract({
    abi: officeLotteryAbi,
    functionName: 'employeeList',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link officeLotteryAbi}__ and `functionName` set to `"employees"`
 */
export const useReadOfficeLotteryEmployees =
  /*#__PURE__*/ createUseReadContract({
    abi: officeLotteryAbi,
    functionName: 'employees',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link officeLotteryAbi}__ and `functionName` set to `"getEmployee"`
 */
export const useReadOfficeLotteryGetEmployee =
  /*#__PURE__*/ createUseReadContract({
    abi: officeLotteryAbi,
    functionName: 'getEmployee',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link officeLotteryAbi}__ and `functionName` set to `"getEmployeeNamesAndWeights"`
 */
export const useReadOfficeLotteryGetEmployeeNamesAndWeights =
  /*#__PURE__*/ createUseReadContract({
    abi: officeLotteryAbi,
    functionName: 'getEmployeeNamesAndWeights',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link officeLotteryAbi}__ and `functionName` set to `"getEmployees"`
 */
export const useReadOfficeLotteryGetEmployees =
  /*#__PURE__*/ createUseReadContract({
    abi: officeLotteryAbi,
    functionName: 'getEmployees',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link officeLotteryAbi}__ and `functionName` set to `"getLastWinner"`
 */
export const useReadOfficeLotteryGetLastWinner =
  /*#__PURE__*/ createUseReadContract({
    abi: officeLotteryAbi,
    functionName: 'getLastWinner',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link officeLotteryAbi}__ and `functionName` set to `"lastDrawBlock"`
 */
export const useReadOfficeLotteryLastDrawBlock =
  /*#__PURE__*/ createUseReadContract({
    abi: officeLotteryAbi,
    functionName: 'lastDrawBlock',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link officeLotteryAbi}__ and `functionName` set to `"lastWinner"`
 */
export const useReadOfficeLotteryLastWinner =
  /*#__PURE__*/ createUseReadContract({
    abi: officeLotteryAbi,
    functionName: 'lastWinner',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link officeLotteryAbi}__ and `functionName` set to `"moderator"`
 */
export const useReadOfficeLotteryModerator =
  /*#__PURE__*/ createUseReadContract({
    abi: officeLotteryAbi,
    functionName: 'moderator',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link officeLotteryAbi}__ and `functionName` set to `"rngContract"`
 */
export const useReadOfficeLotteryRngContract =
  /*#__PURE__*/ createUseReadContract({
    abi: officeLotteryAbi,
    functionName: 'rngContract',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link officeLotteryAbi}__
 */
export const useWriteOfficeLottery = /*#__PURE__*/ createUseWriteContract({
  abi: officeLotteryAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link officeLotteryAbi}__ and `functionName` set to `"addEmployee"`
 */
export const useWriteOfficeLotteryAddEmployee =
  /*#__PURE__*/ createUseWriteContract({
    abi: officeLotteryAbi,
    functionName: 'addEmployee',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link officeLotteryAbi}__ and `functionName` set to `"runLottery"`
 */
export const useWriteOfficeLotteryRunLottery =
  /*#__PURE__*/ createUseWriteContract({
    abi: officeLotteryAbi,
    functionName: 'runLottery',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link officeLotteryAbi}__ and `functionName` set to `"setActive"`
 */
export const useWriteOfficeLotterySetActive =
  /*#__PURE__*/ createUseWriteContract({
    abi: officeLotteryAbi,
    functionName: 'setActive',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link officeLotteryAbi}__
 */
export const useSimulateOfficeLottery = /*#__PURE__*/ createUseSimulateContract(
  { abi: officeLotteryAbi },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link officeLotteryAbi}__ and `functionName` set to `"addEmployee"`
 */
export const useSimulateOfficeLotteryAddEmployee =
  /*#__PURE__*/ createUseSimulateContract({
    abi: officeLotteryAbi,
    functionName: 'addEmployee',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link officeLotteryAbi}__ and `functionName` set to `"runLottery"`
 */
export const useSimulateOfficeLotteryRunLottery =
  /*#__PURE__*/ createUseSimulateContract({
    abi: officeLotteryAbi,
    functionName: 'runLottery',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link officeLotteryAbi}__ and `functionName` set to `"setActive"`
 */
export const useSimulateOfficeLotterySetActive =
  /*#__PURE__*/ createUseSimulateContract({
    abi: officeLotteryAbi,
    functionName: 'setActive',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link officeLotteryAbi}__
 */
export const useWatchOfficeLotteryEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: officeLotteryAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link officeLotteryAbi}__ and `eventName` set to `"EmployeeAdded"`
 */
export const useWatchOfficeLotteryEmployeeAddedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: officeLotteryAbi,
    eventName: 'EmployeeAdded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link officeLotteryAbi}__ and `eventName` set to `"EmployeeStatusUpdated"`
 */
export const useWatchOfficeLotteryEmployeeStatusUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: officeLotteryAbi,
    eventName: 'EmployeeStatusUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link officeLotteryAbi}__ and `eventName` set to `"WinnerSelected"`
 */
export const useWatchOfficeLotteryWinnerSelectedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: officeLotteryAbi,
    eventName: 'WinnerSelected',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link randomNumberGeneratorAbi}__
 */
export const useReadRandomNumberGenerator = /*#__PURE__*/ createUseReadContract(
  { abi: randomNumberGeneratorAbi },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link randomNumberGeneratorAbi}__ and `functionName` set to `"CALLBACK_GAS_LIMIT"`
 */
export const useReadRandomNumberGeneratorCallbackGasLimit =
  /*#__PURE__*/ createUseReadContract({
    abi: randomNumberGeneratorAbi,
    functionName: 'CALLBACK_GAS_LIMIT',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link randomNumberGeneratorAbi}__ and `functionName` set to `"KEY_HASH"`
 */
export const useReadRandomNumberGeneratorKeyHash =
  /*#__PURE__*/ createUseReadContract({
    abi: randomNumberGeneratorAbi,
    functionName: 'KEY_HASH',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link randomNumberGeneratorAbi}__ and `functionName` set to `"NUM_WORDS"`
 */
export const useReadRandomNumberGeneratorNumWords =
  /*#__PURE__*/ createUseReadContract({
    abi: randomNumberGeneratorAbi,
    functionName: 'NUM_WORDS',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link randomNumberGeneratorAbi}__ and `functionName` set to `"REQUEST_CONFIRMATIONS"`
 */
export const useReadRandomNumberGeneratorRequestConfirmations =
  /*#__PURE__*/ createUseReadContract({
    abi: randomNumberGeneratorAbi,
    functionName: 'REQUEST_CONFIRMATIONS',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link randomNumberGeneratorAbi}__ and `functionName` set to `"VRF_COORDINATOR"`
 */
export const useReadRandomNumberGeneratorVrfCoordinator =
  /*#__PURE__*/ createUseReadContract({
    abi: randomNumberGeneratorAbi,
    functionName: 'VRF_COORDINATOR',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link randomNumberGeneratorAbi}__ and `functionName` set to `"getRandomNumber"`
 */
export const useReadRandomNumberGeneratorGetRandomNumber =
  /*#__PURE__*/ createUseReadContract({
    abi: randomNumberGeneratorAbi,
    functionName: 'getRandomNumber',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link randomNumberGeneratorAbi}__ and `functionName` set to `"owner"`
 */
export const useReadRandomNumberGeneratorOwner =
  /*#__PURE__*/ createUseReadContract({
    abi: randomNumberGeneratorAbi,
    functionName: 'owner',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link randomNumberGeneratorAbi}__ and `functionName` set to `"randomResult"`
 */
export const useReadRandomNumberGeneratorRandomResult =
  /*#__PURE__*/ createUseReadContract({
    abi: randomNumberGeneratorAbi,
    functionName: 'randomResult',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link randomNumberGeneratorAbi}__ and `functionName` set to `"s_vrfCoordinator"`
 */
export const useReadRandomNumberGeneratorSVrfCoordinator =
  /*#__PURE__*/ createUseReadContract({
    abi: randomNumberGeneratorAbi,
    functionName: 's_vrfCoordinator',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link randomNumberGeneratorAbi}__ and `functionName` set to `"subscriptionId"`
 */
export const useReadRandomNumberGeneratorSubscriptionId =
  /*#__PURE__*/ createUseReadContract({
    abi: randomNumberGeneratorAbi,
    functionName: 'subscriptionId',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link randomNumberGeneratorAbi}__
 */
export const useWriteRandomNumberGenerator =
  /*#__PURE__*/ createUseWriteContract({ abi: randomNumberGeneratorAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link randomNumberGeneratorAbi}__ and `functionName` set to `"acceptOwnership"`
 */
export const useWriteRandomNumberGeneratorAcceptOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: randomNumberGeneratorAbi,
    functionName: 'acceptOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link randomNumberGeneratorAbi}__ and `functionName` set to `"rawFulfillRandomWords"`
 */
export const useWriteRandomNumberGeneratorRawFulfillRandomWords =
  /*#__PURE__*/ createUseWriteContract({
    abi: randomNumberGeneratorAbi,
    functionName: 'rawFulfillRandomWords',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link randomNumberGeneratorAbi}__ and `functionName` set to `"requestRandomNumber"`
 */
export const useWriteRandomNumberGeneratorRequestRandomNumber =
  /*#__PURE__*/ createUseWriteContract({
    abi: randomNumberGeneratorAbi,
    functionName: 'requestRandomNumber',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link randomNumberGeneratorAbi}__ and `functionName` set to `"setCoordinator"`
 */
export const useWriteRandomNumberGeneratorSetCoordinator =
  /*#__PURE__*/ createUseWriteContract({
    abi: randomNumberGeneratorAbi,
    functionName: 'setCoordinator',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link randomNumberGeneratorAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteRandomNumberGeneratorTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: randomNumberGeneratorAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link randomNumberGeneratorAbi}__
 */
export const useSimulateRandomNumberGenerator =
  /*#__PURE__*/ createUseSimulateContract({ abi: randomNumberGeneratorAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link randomNumberGeneratorAbi}__ and `functionName` set to `"acceptOwnership"`
 */
export const useSimulateRandomNumberGeneratorAcceptOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: randomNumberGeneratorAbi,
    functionName: 'acceptOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link randomNumberGeneratorAbi}__ and `functionName` set to `"rawFulfillRandomWords"`
 */
export const useSimulateRandomNumberGeneratorRawFulfillRandomWords =
  /*#__PURE__*/ createUseSimulateContract({
    abi: randomNumberGeneratorAbi,
    functionName: 'rawFulfillRandomWords',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link randomNumberGeneratorAbi}__ and `functionName` set to `"requestRandomNumber"`
 */
export const useSimulateRandomNumberGeneratorRequestRandomNumber =
  /*#__PURE__*/ createUseSimulateContract({
    abi: randomNumberGeneratorAbi,
    functionName: 'requestRandomNumber',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link randomNumberGeneratorAbi}__ and `functionName` set to `"setCoordinator"`
 */
export const useSimulateRandomNumberGeneratorSetCoordinator =
  /*#__PURE__*/ createUseSimulateContract({
    abi: randomNumberGeneratorAbi,
    functionName: 'setCoordinator',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link randomNumberGeneratorAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateRandomNumberGeneratorTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: randomNumberGeneratorAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link randomNumberGeneratorAbi}__
 */
export const useWatchRandomNumberGeneratorEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: randomNumberGeneratorAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link randomNumberGeneratorAbi}__ and `eventName` set to `"CoordinatorSet"`
 */
export const useWatchRandomNumberGeneratorCoordinatorSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: randomNumberGeneratorAbi,
    eventName: 'CoordinatorSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link randomNumberGeneratorAbi}__ and `eventName` set to `"OwnershipTransferRequested"`
 */
export const useWatchRandomNumberGeneratorOwnershipTransferRequestedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: randomNumberGeneratorAbi,
    eventName: 'OwnershipTransferRequested',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link randomNumberGeneratorAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchRandomNumberGeneratorOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: randomNumberGeneratorAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link randomNumberGeneratorAbi}__ and `eventName` set to `"RandomNumberGenerated"`
 */
export const useWatchRandomNumberGeneratorRandomNumberGeneratedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: randomNumberGeneratorAbi,
    eventName: 'RandomNumberGenerated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link randomNumberGeneratorAbi}__ and `eventName` set to `"RandomNumberRequested"`
 */
export const useWatchRandomNumberGeneratorRandomNumberRequestedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: randomNumberGeneratorAbi,
    eventName: 'RandomNumberRequested',
  })
