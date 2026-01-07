import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, PropsWithChildren } from 'react';
import {
  WalletType,
  NetworkType,
} from '../types';
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
} from '../types';
import { FreighterAdapter } from '../adapters/FreighterAdapter';
import { fetchAccountBalances } from '../utils/balanceUtils';

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

const STORAGE_KEY = 'stellar_wallet_kit';

interface StorageData {
  selectedWallet: WalletType | null;
  autoConnect: boolean;
}

const getStorageData = (): StorageData => {
  if (typeof window === 'undefined') {
    return { selectedWallet: null, autoConnect: false };
  }
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { selectedWallet: null, autoConnect: false };
  } catch {
    return { selectedWallet: null, autoConnect: false };
  }
};

const setStorageData = (data: Partial<StorageData>) => {
  if (typeof window === 'undefined') return;
  try {
    const existing = getStorageData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, ...data }));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Wallet registry - add new wallet adapters here
const walletAdapters: Record<WalletType, WalletAdapter> = {
  [WalletType.FREIGHTER]: new FreighterAdapter(),
};

const walletMetadata: Record<WalletType, Omit<WalletInfo, 'installed'>> = {
  [WalletType.FREIGHTER]: {
    id: WalletType.FREIGHTER,
    name: 'Freighter',
    icon: 'https://stellar.creit.tech/wallet-icons/freighter.svg',
    description: 'Freighter browser extension wallet',
    downloadUrl: 'https://chrome.google.com/webstore/detail/freighter/bcacfldlkkdogcmkkibnjlakofdplcbk',
  },
};

type WalletProviderProps = PropsWithChildren<{
  config?: StellarWalletKitConfig;
}>;

export function WalletProvider({ config = {}, children }: WalletProviderProps) {
  const [account, setAccount] = useState<WalletAccount | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [network, setNetwork] = useState<NetworkType>(config.network || NetworkType.TESTNET);
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);
  const [availableWallets, setAvailableWallets] = useState<WalletInfo[]>([]);
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);

  const isConnected = !!account;

  // Check available wallets on mount
  useEffect(() => {
    if (!isBrowser) return;
    
    const checkWallets = async () => {
      const wallets: WalletInfo[] = [];
      
      for (const [type, adapter] of Object.entries(walletAdapters)) {
        const installed = await adapter.isAvailable();
        wallets.push({
          ...walletMetadata[type as WalletType],
          installed,
        });
      }
      
      setAvailableWallets(wallets);
    };

    checkWallets();
  }, []);

  // Auto-connect on mount if configured
  useEffect(() => {
    if (!isBrowser) return;
    
    const autoConnectWallet = async () => {
      const storage = getStorageData();
      
      if (config.autoConnect && storage.selectedWallet) {
        try {
          await connect(storage.selectedWallet);
        } catch (err) {
          console.error('Auto-connect failed:', err);
        }
      }
    };

    autoConnectWallet();
  }, [config.autoConnect]);

  const refreshBalances = useCallback(async () => {
    if (!account?.publicKey) {
      return;
    }

    setIsLoadingBalances(true);
    try {
      const balances = await fetchAccountBalances(account.publicKey, network);
      setAccount(prev => prev ? { ...prev, balances } : null);
    } catch (err) {
      console.error('Failed to fetch balances:', err);
      // Don't set error state for balance fetch failures
    } finally {
      setIsLoadingBalances(false);
    }
  }, [account?.publicKey, network]);

  const connect = useCallback(async (walletType?: WalletType) => {
    setIsConnecting(true);
    setError(null);

    try {
      const typeToConnect = walletType || config.defaultWallet || WalletType.FREIGHTER;
      const adapter = walletAdapters[typeToConnect];

      if (!adapter) {
        throw new Error(`Wallet adapter not found for ${typeToConnect}`);
      }

      const available = await adapter.isAvailable();
      if (!available) {
        throw new Error(`${walletMetadata[typeToConnect].name} is not installed`);
      }

      const response = await adapter.connect();

      const newAccount: WalletAccount = {
        address: response.address,
        publicKey: response.publicKey,
        displayName: `${response.address.slice(0, 4)}...${response.address.slice(-4)}`,
      };

      setAccount(newAccount);
      setSelectedWallet(typeToConnect);
      setStorageData({ selectedWallet: typeToConnect, autoConnect: true });

      // Fetch balances after connecting
      try {
        const balances = await fetchAccountBalances(response.publicKey, network);
        setAccount(prev => prev ? { ...prev, balances } : null);
      } catch (balanceError) {
        console.error('Failed to fetch initial balances:', balanceError);
        // Don't fail the connection if balance fetch fails
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to connect wallet');
      setError(error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, [config.defaultWallet]);

  const disconnect = useCallback(async () => {
    try {
      if (selectedWallet) {
        const adapter = walletAdapters[selectedWallet];
        await adapter.disconnect();
      }
      
      setAccount(null);
      setSelectedWallet(null);
      setError(null);
      setStorageData({ selectedWallet: null, autoConnect: false });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to disconnect wallet');
      setError(error);
      throw error;
    }
  }, [selectedWallet]);

  const signTransaction = useCallback(async (
    xdr: string,
    options?: SignTransactionOptions
  ): Promise<SignTransactionResponse> => {
    if (!selectedWallet) {
      throw new Error('No wallet connected');
    }

    const adapter = walletAdapters[selectedWallet];
    return adapter.signTransaction(xdr, options);
  }, [selectedWallet]);

  const signAuthEntry = useCallback(async (
    entryXdr: string,
    options?: SignAuthEntryOptions
  ): Promise<SignAuthEntryResponse> => {
    if (!selectedWallet) {
      throw new Error('No wallet connected');
    }

    const adapter = walletAdapters[selectedWallet];
    return adapter.signAuthEntry(entryXdr, options);
  }, [selectedWallet]);

  const switchNetwork = useCallback(async (newNetwork: NetworkType) => {
    setNetwork(newNetwork);
    // Refresh balances when network changes
    if (account?.publicKey) {
      await refreshBalances();
    }
  }, [account?.publicKey, refreshBalances]);

  // Auto-refresh balances periodically
  useEffect(() => {
    if (!account?.publicKey || !isBrowser) return;

    // Initial balance fetch
    refreshBalances();

    // Set up periodic refresh (every 30 seconds)
    const interval = setInterval(() => {
      refreshBalances();
    }, 30000);

    return () => clearInterval(interval);
  }, [account?.publicKey, refreshBalances]);

  const value = useMemo<WalletContextValue>(
    () => ({
      account,
      isConnected,
      isConnecting,
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
    }),
    [
      account,
      isConnected,
      isConnecting,
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
    ]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet(): WalletContextValue {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}