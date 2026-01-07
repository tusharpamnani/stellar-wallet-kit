// Context and Provider
export { WalletProvider, useWallet } from './context/WalletContext';

// Components
export { ConnectButton } from './components/ConnectButton';
export { WalletModal } from './components/WalletModal';

// Utilities
export {
  fetchAccountBalances,
  getNativeBalance,
  formatBalance,
  getAssetBalance,
  hasSufficientBalance,
  getTotalValueXLM,
  groupBalancesByType,
} from './utils/balanceUtils';

// Types
export type {
  WalletAccount,
  WalletInfo,
  ConnectWalletResponse,
  SignTransactionResponse,
  SignAuthEntryResponse,
  WalletAdapter,
  SignTransactionOptions,
  SignAuthEntryOptions,
  StellarWalletKitConfig,
  WalletTheme,
  ModalProps,
  WalletContextValue,
  AccountBalance,
} from './types';

// Adapters (if users want to create custom adapters)
export { FreighterAdapter } from './adapters/FreighterAdapter';

// Re-export enums
export { WalletType, NetworkType } from './types';