"use client";

import { createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [metaMask()],
  transports: {
    [baseSepolia.id]: http(
      "https://base-sepolia.g.alchemy.com/v2/T0PE-HxhWOEH0eUNTcUOFgPQJiQzL6uf"
    ),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
