export interface ContractConfig {
  address: string;
  abi: unknown[];
  chainId: number;
}

// Placeholder contract configuration - to be replaced with actual contract details
export const CONTRACT_CONFIG: ContractConfig = {
  address: "0x0000000000000000000000000000000000000000", // Will be provided by user
  abi: [], // Will be provided by user
  chainId: 1, // Ethereum mainnet - adjust as needed
};

// Contract function signatures that the frontend expects
export interface LotteryContract {
  // Employee Management
  addEmployee: (name: string, address: string) => Promise<unknown>;
  removeEmployee: (address: string) => Promise<unknown>;
  getEmployees: () => Promise<Employee[]>;
  isModerator: (address: string) => Promise<boolean>;

  // Presence Management
  setPresence: (addresses: string[], present: boolean[]) => Promise<unknown>;
  getTodaysPresence: () => Promise<string[]>;

  // Lottery Functions
  runLotteryDraw: () => Promise<LotteryResult>;
  getTodaysWinner: () => Promise<LotteryResult | null>;
  hasDrawnToday: () => Promise<boolean>;
  getEmployeeProbabilities: () => Promise<EmployeeProbability[]>;
}

export interface Employee {
  id: number;
  name: string;
  address: string;
  addedBy: string;
  dateAdded: string;
}

export interface EmployeeProbability {
  address: string;
  probability: number;
  daysSinceLastPaid: number;
}

export interface LotteryResult {
  winner: {
    name: string;
    address: string;
  };
  timestamp: Date;
  transactionHash: string;
  blockNumber: number;
}

// Contract interaction utilities
export class ContractError extends Error {
  constructor(
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = "ContractError";
  }
}

export const formatContractError = (error: unknown): string => {
  if (typeof error === "object" && error !== null) {
    const err = error as { code?: string; message?: string };
    if (err.code === "ACTION_REJECTED") {
      return "Transaction was rejected by user";
    }
    if (err.code === "INSUFFICIENT_FUNDS") {
      return "Insufficient funds for transaction";
    }
    if (err.message?.includes("execution reverted")) {
      return "Smart contract execution failed. Check requirements.";
    }
    return err.message || "Unknown contract error occurred";
  }
  return "Unknown contract error occurred";
};
