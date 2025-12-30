"use client";

import { useCallback, useMemo, useState } from "react";
import { StellarWalletContext } from "./StellarWalletContext";
import { createSwkAdapter } from "../adapters";
import type { StellarNetwork } from "../utils/network";

export function StellarWalletProvider({
  children,
  network = "testnet",
}: {
  children: React.ReactNode;
  network?: StellarNetwork;
}) {
  const adapter = useMemo(() => createSwkAdapter(network), [network]);

  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async () => {
    try {
      setIsConnecting(true);
      const { address } = await adapter.connect();
      setAddress(address);
    } finally {
      setIsConnecting(false);
    }
  }, [adapter]);

  const disconnect = useCallback(async () => {
    await adapter.disconnect();
    setAddress(null);
  }, [adapter]);

  const signTransaction = useCallback(
    async (xdr: string) => {
      const { signedTxXdr } = await adapter.signTransaction(xdr);
      return signedTxXdr;
    },
    [adapter]
  );

  return (
    <StellarWalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        isConnecting,
        connect,
        disconnect,
        signTransaction,
      }}
    >
      {children}
    </StellarWalletContext.Provider>
  );
}
