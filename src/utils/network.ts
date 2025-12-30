// src/utils/network.ts
import { Networks } from "@creit-tech/stellar-wallets-kit/types";

export type StellarNetwork = "testnet" | "public";

export function toSwkNetwork(network: StellarNetwork): Networks {
  switch (network) {
    case "public":
      return Networks.PUBLIC;
    case "testnet":
    default:
      return Networks.TESTNET;
  }
}

export function toSdkNetwork(network: StellarNetwork): Networks {
  return network === "public" ? Networks.PUBLIC : Networks.TESTNET;
}