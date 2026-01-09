// src/lib/wallets.ts
import { createWalletAdapters } from 'stellar-wallet-kit'
import { WalletType } from 'stellar-wallet-kit'

export const adapters = createWalletAdapters({
  walletConnectProjectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
})
