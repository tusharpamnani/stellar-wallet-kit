import { useContext } from "react";
import { StellarWalletContext } from "../provider/StellarWalletContext";

export function useStellarWallet() {
  const ctx = useContext(StellarWalletContext);
  if (!ctx) {
    throw new Error(
      "useStellarWallet must be used inside StellarWalletProvider"
    );
  }
  return ctx;
}
