"use client";

import { useEffect } from "react";
import { useChainId, useSwitchChain } from "wagmi";
import { baseSepolia } from "wagmi/chains";

export function EnforceChain({ children }: { children: React.ReactNode }) {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    // If user is connected to a different chain, switch to Base Sepolia
    if (chainId !== baseSepolia.id) {
      switchChain({ chainId: baseSepolia.id });
    }
  }, [chainId, switchChain]);

  return <>{children}</>;
}
