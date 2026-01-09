'use client';

import { WalletProvider, NetworkType, createWalletAdapters } from 'stellar-wallet-kit';
import type { ReactNode } from 'react';

const adapters = createWalletAdapters({
  walletConnectProjectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
});


interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <WalletProvider
      config={{
        network: NetworkType.TESTNET,
        autoConnect: true,
        adapters,
        appName: "My Stellar dApp",
        appIcon: "https://stellar.org/favicon.ico",
        theme: {
          mode: "dark",
          primaryColor: "#8b5cf6",
          borderRadius: "16px",
        },
      }}
    >
      {children}
    </WalletProvider>
  );
}