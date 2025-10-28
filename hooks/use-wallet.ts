"use client"

import { useState, useEffect, createContext, useContext } from "react"

export interface WalletState {
  address: string | null
  isConnected: boolean
  isConnecting: boolean
  chainId: number | null
  error: string | null
}

export interface WalletContextType extends WalletState {
  connect: () => Promise<void>
  disconnect: () => void
  switchChain: (chainId: number) => Promise<void>
}

const WalletContext = createContext<WalletContextType | null>(null)

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider")
  }
  return context
}

// Mock wallet implementation - replace with actual wallet integration (wagmi, ethers, etc.)
export const useWalletConnection = (): WalletContextType => {
  const [state, setState] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    chainId: null,
    error: null,
  })

  useEffect(() => {
    // Check for existing connection on mount
    checkExistingConnection()
  }, [])

  const checkExistingConnection = async () => {
    try {
      // Mock: Check if wallet is already connected
      // Replace with actual wallet detection logic
      const mockConnected = localStorage.getItem("wallet_connected") === "true"
      if (mockConnected) {
        setState((prev) => ({
          ...prev,
          address: "0x1234567890123456789012345678901234567890",
          isConnected: true,
          chainId: 1,
        }))
      }
    } catch (error) {
      console.error("Failed to check wallet connection:", error)
    }
  }

  const connect = async () => {
    setState((prev) => ({ ...prev, isConnecting: true, error: null }))

    try {
      // Mock wallet connection - replace with actual wallet integration
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful connection
      const mockAddress = "0x1234567890123456789012345678901234567890"
      localStorage.setItem("wallet_connected", "true")

      setState((prev) => ({
        ...prev,
        address: mockAddress,
        isConnected: true,
        isConnecting: false,
        chainId: 1,
      }))
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: error.message || "Failed to connect wallet",
      }))
    }
  }

  const disconnect = () => {
    localStorage.removeItem("wallet_connected")
    setState({
      address: null,
      isConnected: false,
      isConnecting: false,
      chainId: null,
      error: null,
    })
  }

  const switchChain = async (chainId: number) => {
    try {
      // Mock chain switching - replace with actual implementation
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setState((prev) => ({ ...prev, chainId }))
    } catch (error: any) {
      setState((prev) => ({ ...prev, error: error.message || "Failed to switch chain" }))
    }
  }

  return {
    ...state,
    connect,
    disconnect,
    switchChain,
  }
}
