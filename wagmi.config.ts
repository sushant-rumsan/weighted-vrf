import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { opayAbi } from "./lib/abis/opay.js";
import { vrfAbi } from "./lib/abis/vrf.js";
import { Abi } from "viem";

export default defineConfig({
  out: "hooks/wagmi/contracts.ts",
  contracts: [
    {
      name: "Office lottery",
      abi: opayAbi as Abi,
    },
    {
      name: "Random number generator",
      abi: vrfAbi as Abi,
    },
  ],
  plugins: [react()],
});
