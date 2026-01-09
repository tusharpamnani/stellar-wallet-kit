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

// Adapter factory (IMPORTANT)
export { createWalletAdapters } from './wallets/createWalletAdapters';

// Adapters (advanced / custom usage)
export { FreighterAdapter } from './adapters/FreighterAdapter';
export { WalletConnectAdapter } from './adapters/WalletConnectAdapter';

// Types
export type {
  WalletAccount,
  WalletInfo,
  WalletAdapter,
  WalletCapabilities,
  ConnectWalletResponse,
  SignTransactionResponse,
  SignAuthEntryResponse,
  SignTransactionOptions,
  SignAuthEntryOptions,
  StellarWalletKitConfig,
  WalletTheme,
  ModalProps,
  WalletContextValue,
  AccountBalance,
  WalletKind,
} from './types';

// Enums
export { WalletType, NetworkType } from './types';
