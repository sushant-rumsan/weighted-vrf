import { createWalletClient, createPublicClient, http, type Address } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { TRANSACTION_SIGNER_PRIVATE_KEY } from "./constants";
import { opayAbi } from "./abis/opay";
import { vrfAbi } from "./abis/vrf";

// Validate private key
if (!TRANSACTION_SIGNER_PRIVATE_KEY || TRANSACTION_SIGNER_PRIVATE_KEY === "0x0000000000000000000000000000000000000000000000000000000000000000") {
  console.warn("TRANSACTION_SIGNER_PRIVATE_KEY is not set. Please set NEXT_PUBLIC_TRANSACTION_SIGNER_PRIVATE_KEY environment variable.");
}

// Create wallet client from private key
const account = privateKeyToAccount(TRANSACTION_SIGNER_PRIVATE_KEY as `0x${string}`);

const transport = http("https://base-sepolia.g.alchemy.com/v2/T0PE-HxhWOEH0eUNTcUOFgPQJiQzL6uf");

const walletClient = createWalletClient({
  account,
  chain: baseSepolia,
  transport,
});

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport,
});

/**
 * Sign and send setActive transaction using private key
 */
export async function signSetActive(contractAddress: Address, employeeAddresses: Address[]) {
  try {
    const hash = await walletClient.writeContract({
      address: contractAddress,
      abi: opayAbi,
      functionName: "setActive",
      args: [employeeAddresses],
    });
    
    // Wait for transaction confirmation
    await publicClient.waitForTransactionReceipt({ hash });
    return hash;
  } catch (error) {
    console.error("Error signing setActive transaction:", error);
    throw error;
  }
}

/**
 * Sign and send requestRandomNumber transaction using private key
 */
export async function signRequestRandomNumber(vrfAddress: Address) {
  try {
    const hash = await walletClient.writeContract({
      address: vrfAddress,
      abi: vrfAbi,
      functionName: "requestRandomNumber",
    });
    
    // Wait for transaction confirmation
    await publicClient.waitForTransactionReceipt({ hash });
    return hash;
  } catch (error) {
    console.error("Error signing requestRandomNumber transaction:", error);
    throw error;
  }
}

/**
 * Sign and send runLottery transaction using private key
 */
export async function signRunLottery(contractAddress: Address) {
  try {
    const hash = await walletClient.writeContract({
      address: contractAddress,
      abi: opayAbi,
      functionName: "runLottery",
    });
    
    // Wait for transaction confirmation
    await publicClient.waitForTransactionReceipt({ hash });
    return hash;
  } catch (error) {
    console.error("Error signing runLottery transaction:", error);
    throw error;
  }
}

