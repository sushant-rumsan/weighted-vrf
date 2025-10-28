// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

// Deployed: 0x6bc8d59fb4a50562f6e934d0e6269316785a551c
// 

import {VRFConsumerBaseV2Plus} from "@chainlink/contracts@1.4.0/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts@1.4.0/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

contract SimpleRandomNumber is VRFConsumerBaseV2Plus {
    uint256 public randomResult;

    // Sepolia VRF Coordinator
    address public constant VRF_COORDINATOR = 0x5C210eF41CD1a72de73bF76eC39637bB0d3d7BEE;
    bytes32 public constant KEY_HASH =
        0x9e1344a1247c8a1785d0a4681a27152bffdb43666ae5bf7d14d24a5efd44bf71;

    uint256 public immutable subscriptionId;
    uint32 public constant CALLBACK_GAS_LIMIT = 100000;
    uint16 public constant REQUEST_CONFIRMATIONS = 1;
    uint32 public constant NUM_WORDS = 1;

    event RandomNumberRequested(uint256 requestId);
    event RandomNumberGenerated(uint256 randomNumber);

    constructor(uint256 _subscriptionId) VRFConsumerBaseV2Plus(VRF_COORDINATOR) {
        subscriptionId = _subscriptionId;
    }

    // Request a new random number
    function requestRandomNumber() external returns (uint256 requestId) {
        requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: KEY_HASH,
                subId: subscriptionId,
                requestConfirmations: REQUEST_CONFIRMATIONS,
                callbackGasLimit: CALLBACK_GAS_LIMIT,
                numWords: NUM_WORDS,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
                )
            })
        );
        emit RandomNumberRequested(requestId);
    }

    // VRF callback
    function fulfillRandomWords(
        uint256, /* requestId */
        uint256[] calldata randomWords
    ) internal override {
        randomResult = randomWords[0] % 101; // Random number between 0–100
        emit RandomNumberGenerated(randomResult);
    }

    // Get the latest random number
    function getRandomNumber() external view returns (uint256) {
        require(randomResult != 0, "Random number not generated yet");
        return randomResult;
    }
}
