// src/types.ts

export type StellarNetwork = "testnet" | "public";

/**
 * Adapter interface – this is the contract that all wallet backends must follow.
 * SWK is just one implementation.
 */
export interface StellarWalletAdapter {
  id: string;
  name: string;

  isAvailable(): Promise<boolean>;

  connect(): Promise<{ address: string }>;
  disconnect(): Promise<void>;

  signTransaction(
    xdr: string,
    opts?: { networkPassphrase?: string }
  ): Promise<{ signedTxXdr: string }>;

  signMessage?(
    message: string
  ): Promise<{ signedMessage: string }>;
}

/**
 * What consumers get from useStellarWallet()
 */
export interface StellarWalletContextValue {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;

  connect(): Promise<void>;
  disconnect(): Promise<void>;

  signTransaction(xdr: string): Promise<string>;
  signMessage?(message: string): Promise<string>;
}
