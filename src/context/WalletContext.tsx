"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  PropsWithChildren,
} from "react";

import {
  WalletType,
  NetworkType,
} from "../types";

import type {
  WalletContextValue,
  WalletAccount,
  StellarWalletKitConfig,
  WalletInfo,
  SignTransactionOptions,
  SignAuthEntryOptions,
  SignTransactionResponse,
  SignAuthEntryResponse,
  WalletAdapter,
} from "../types";

import { FreighterAdapter } from "../adapters/FreighterAdapter";
import { AlbedoAdapter } from "../adapters/AlbedoAdapter";
import { fetchAccountBalances } from "../utils/balanceUtils";

/* ------------------------------------------------------------------ */
/* Constants */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "stellar_wallet_kit";
const isBrowser = typeof window !== "undefined";

const DEFAULT_SUPPORTS = {
  silentReconnect: false,
  networkDetection: false,
  authEntrySigning: false,
};

/* ------------------------------------------------------------------ */
/* Context */
/* ------------------------------------------------------------------ */

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

/* ------------------------------------------------------------------ */
/* Wallet metadata */
/* ------------------------------------------------------------------ */

const walletMetadata: Record<WalletType, Omit<WalletInfo, "installed">> = {
  [WalletType.FREIGHTER]: {
    id: WalletType.FREIGHTER,
    name: "Freighter",
    icon: "https://stellar.creit.tech/wallet-icons/freighter.svg",
    description: "Freighter browser extension wallet",
    downloadUrl:
      "https://chrome.google.com/webstore/detail/freighter/bcacfldlkkdogcmkkibnjlakofdplcbk",
    kind: "extension",
    capabilities: {
      silentReconnect: true,
      networkDetection: true,
      authEntrySigning: true,
    },
  },

  [WalletType.ALBEDO]: {
    id: WalletType.ALBEDO,
    name: "Albedo",
    icon: "https://stellar.creit.tech/wallet-icons/albedo.svg",
    description: "Web-based Stellar wallet",
    kind: "web",
    capabilities: {
      silentReconnect: false,
      networkDetection: false,
      authEntrySigning: true,
    },
  },

  [WalletType.WALLETCONNECT]: {
    id: WalletType.WALLETCONNECT,
    name: "WalletConnect",
    icon: "https://walletconnect.com/walletconnect-logo.png",
    description: "Connect mobile wallets via WalletConnect",
    kind: "web",
    capabilities: {
      silentReconnect: true,
      networkDetection: false,
      authEntrySigning: false,
    },
  },

  [WalletType.LOBSTR]: {
    id: WalletType.LOBSTR,
    name: "LOBSTR",
    icon: "https://lobstr.co/favicon.ico",
    description: "LOBSTR mobile wallet",
    kind: "web",
    capabilities: {
      silentReconnect: true,
      networkDetection: false,
      authEntrySigning: false,
    },
  },
};

/* ------------------------------------------------------------------ */
/* Storage helpers */
/* ------------------------------------------------------------------ */

interface StorageData {
  selectedWallet: WalletType | null;
  autoConnect: boolean;
}

function getStorageData(): StorageData {
  if (!isBrowser) {
    return { selectedWallet: null, autoConnect: false };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw
      ? JSON.parse(raw)
      : { selectedWallet: null, autoConnect: false };
  } catch {
    return { selectedWallet: null, autoConnect: false };
  }
}

function setStorageData(data: Partial<StorageData>) {
  if (!isBrowser) return;

  const existing = getStorageData();
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...existing, ...data })
  );
}

/* ------------------------------------------------------------------ */
/* Provider */
/* ------------------------------------------------------------------ */

type WalletProviderProps = PropsWithChildren<{
  config?: StellarWalletKitConfig;
}>;

export function WalletProvider({ config = {}, children }: WalletProviderProps) {
  const [account, setAccount] = useState<WalletAccount | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingWallet, setConnectingWallet] =
    useState<WalletType | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [network, setNetwork] = useState<NetworkType>(
    config.network || NetworkType.TESTNET
  );
  const [selectedWallet, setSelectedWallet] =
    useState<WalletType | null>(null);
  const [availableWallets, setAvailableWallets] = useState<WalletInfo[]>([]);
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);

  const isConnected = !!account;

  /* ------------------------------------------------------------------ */
  /* Wallet adapters */
  /* ------------------------------------------------------------------ */

  const walletAdapters = useMemo<
    Partial<Record<WalletType, WalletAdapter>>
  >(
    () => ({
      [WalletType.FREIGHTER]: new FreighterAdapter(),
      [WalletType.ALBEDO]: new AlbedoAdapter(),
      ...(config.adapters ?? {}),
    }),
    [config.adapters]
  );

  /* ------------------------------------------------------------------ */
  /* Detect wallets */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    if (!isBrowser) return;

    (async () => {
      const wallets: WalletInfo[] = [];

      const entries = Object.entries(walletAdapters) as [
        WalletType,
        WalletAdapter | undefined
      ][];

      for (const [walletType, adapter] of entries) {
        if (!adapter) continue;

        const meta = walletMetadata[walletType];

        let installed = true;
        if (meta.kind === "extension") {
          installed = await adapter.isAvailable();
        }

        wallets.push({ ...meta, installed });
      }

      setAvailableWallets(wallets);
    })();
  }, [walletAdapters]);

  /* ------------------------------------------------------------------ */
  /* Auto-connect */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    if (!isBrowser || !config.autoConnect) return;

    const { selectedWallet } = getStorageData();
    if (selectedWallet) {
      connect(selectedWallet).catch(() => {});
    }
  }, [config.autoConnect]);

  /* ------------------------------------------------------------------ */
  /* Balances */
  /* ------------------------------------------------------------------ */

  const refreshBalances = useCallback(async () => {
    if (!account?.publicKey) return;

    setIsLoadingBalances(true);
    try {
      const balances = await fetchAccountBalances(
        account.publicKey,
        network
      );
      setAccount((prev) => (prev ? { ...prev, balances } : null));
    } finally {
      setIsLoadingBalances(false);
    }
  }, [account?.publicKey, network]);

  /* ------------------------------------------------------------------ */
  /* Connect */
  /* ------------------------------------------------------------------ */

  const connect = useCallback(
    async (walletType?: WalletType) => {
      const type =
        walletType || config.defaultWallet || WalletType.FREIGHTER;

      setIsConnecting(true);
      setConnectingWallet(type);
      setError(null);

      try {
        const adapter = walletAdapters[type];
        if (!adapter) {
          throw new Error(`Wallet adapter not configured: ${type}`);
        }

        const meta = walletMetadata[type];

        if (meta.kind === "extension") {
          const ok = await adapter.isAvailable();
          if (!ok) {
            throw new Error(`${meta.name} is not installed`);
          }
        }

        const res = await adapter.connect();

        setAccount({
          address: res.address,
          publicKey: res.publicKey,
          displayName: `${res.address.slice(0, 4)}…${res.address.slice(-4)}`,
        });

        setSelectedWallet(type);
        setStorageData({ selectedWallet: type, autoConnect: true });

        await refreshBalances();
      } catch (e) {
        setError(e as Error);
        throw e;
      } finally {
        setIsConnecting(false);
        setConnectingWallet(null);
      }
    },
    [config.defaultWallet, refreshBalances, walletAdapters]
  );

  /* ------------------------------------------------------------------ */
  /* Disconnect */
  /* ------------------------------------------------------------------ */

  const disconnect = useCallback(async () => {
    if (selectedWallet) {
      await walletAdapters[selectedWallet]?.disconnect();
    }

    setAccount(null);
    setSelectedWallet(null);
    setError(null);
    setStorageData({ selectedWallet: null, autoConnect: false });
  }, [selectedWallet, walletAdapters]);

  /* ------------------------------------------------------------------ */
  /* Signing */
  /* ------------------------------------------------------------------ */

  const signTransaction = useCallback(
    (
      xdr: string,
      options?: SignTransactionOptions
    ): Promise<SignTransactionResponse> => {
      if (!selectedWallet) {
        throw new Error("No wallet connected");
      }

      const adapter = walletAdapters[selectedWallet];
      if (!adapter) {
        throw new Error("Wallet adapter missing");
      }

      return adapter.signTransaction(xdr, options);
    },
    [selectedWallet, walletAdapters]
  );

  const signAuthEntry = useCallback(
    (
      entryXdr: string,
      options?: SignAuthEntryOptions
    ): Promise<SignAuthEntryResponse> => {
      if (!selectedWallet) {
        throw new Error("No wallet connected");
      }

      const adapter = walletAdapters[selectedWallet];
      if (!adapter) {
        throw new Error("Wallet adapter missing");
      }

      return adapter.signAuthEntry(entryXdr, options);
    },
    [selectedWallet, walletAdapters]
  );

  /* ------------------------------------------------------------------ */
  /* Network */
  /* ------------------------------------------------------------------ */

  const switchNetwork = useCallback(
    async (n: NetworkType) => {
      setNetwork(n);
      await refreshBalances();
    },
    [refreshBalances]
  );

  /* ------------------------------------------------------------------ */
  /* Capabilities */
  /* ------------------------------------------------------------------ */

  const supports = useMemo(() => {
    if (!selectedWallet) return DEFAULT_SUPPORTS;

    const caps = walletMetadata[selectedWallet].capabilities;
    return {
      silentReconnect: caps?.silentReconnect ?? false,
      networkDetection: caps?.networkDetection ?? false,
      authEntrySigning: caps?.authEntrySigning ?? false,
    };
  }, [selectedWallet]);

  /* ------------------------------------------------------------------ */
  /* Context value */
  /* ------------------------------------------------------------------ */

  const value = useMemo<WalletContextValue>(
    () => ({
      account,
      isConnected,
      isConnecting,
      connectingWallet,
      error,
      network,
      selectedWallet,
      connect,
      disconnect,
      signTransaction,
      signAuthEntry,
      switchNetwork,
      availableWallets,
      refreshBalances,
      isLoadingBalances,
      supports,
    }),
    [
      account,
      isConnected,
      isConnecting,
      connectingWallet,
      error,
      network,
      selectedWallet,
      connect,
      disconnect,
      signTransaction,
      signAuthEntry,
      switchNetwork,
      availableWallets,
      refreshBalances,
      isLoadingBalances,
      supports,
    ]
  );

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Hook */
/* ------------------------------------------------------------------ */

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return ctx;
}
