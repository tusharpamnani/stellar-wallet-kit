export enum WalletType {
  FREIGHTER = 'freighter',
  // Add more wallet types as needed
  // XBULL = 'xbull',
  // ALBEDO = 'albedo',
}

export enum NetworkType {
  PUBLIC = 'PUBLIC',
  TESTNET = 'TESTNET',
  FUTURENET = 'FUTURENET',
  STANDALONE = 'STANDALONE',
}

export interface WalletAccount {
  address: string;
  publicKey: string;
  displayName?: string;
  balances?: AccountBalance[];
}

export interface AccountBalance {
  asset_type: string;
  asset_code?: string;
  asset_issuer?: string;
  balance: string;
  limit?: string;
  buying_liabilities?: string;
  selling_liabilities?: string;
  is_authorized?: boolean;
  is_authorized_to_maintain_liabilities?: boolean;
  last_modified_ledger?: number;
  sponsor?: string;
}

export interface WalletInfo {
  id: WalletType;
  name: string;
  icon: string;
  description?: string;
  installed: boolean;
  downloadUrl?: string;
}

export interface ConnectWalletResponse {
  address: string;
  publicKey: string;
}

export interface SignTransactionResponse {
  signedTxXdr: string;
}

export interface SignAuthEntryResponse {
  signedAuthEntry: string;
}

export interface WalletAdapter {
  type: WalletType;
  isAvailable(): Promise<boolean>;
  connect(): Promise<ConnectWalletResponse>;
  disconnect(): Promise<void>;
  getPublicKey(): Promise<string | null>;
  getNetwork(): Promise<string>;
  signTransaction(xdr: string, options?: SignTransactionOptions): Promise<SignTransactionResponse>;
  signAuthEntry(entryXdr: string, options?: SignAuthEntryOptions): Promise<SignAuthEntryResponse>;
}

export interface SignTransactionOptions {
  network?: string;
  networkPassphrase?: string;
  accountToSign?: string;
}

export interface SignAuthEntryOptions {
  accountToSign?: string;
}

export interface StellarWalletKitConfig {
  network?: NetworkType;
  defaultWallet?: WalletType;
  autoConnect?: boolean;
  theme?: WalletTheme;
  appName?: string;
  appIcon?: string;
}

export interface WalletTheme {
  mode?: 'light' | 'dark' | 'auto';
  primaryColor?: string;
  backgroundColor?: string;
  borderRadius?: string;
  fontFamily?: string;
  overlayBackground?: string;
  modalBackground?: string;
  textColor?: string;
  buttonHoverColor?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallets: WalletInfo[];
  onSelectWallet: (walletType: WalletType) => void;
  theme?: WalletTheme;
  appName?: string;
  appIcon?: string;
}

export interface WalletContextValue {
  account: WalletAccount | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  network: NetworkType;
  selectedWallet: WalletType | null;
  connect: (walletType?: WalletType) => Promise<void>;
  disconnect: () => Promise<void>;
  signTransaction: (xdr: string, options?: SignTransactionOptions) => Promise<SignTransactionResponse>;
  signAuthEntry: (entryXdr: string, options?: SignAuthEntryOptions) => Promise<SignAuthEntryResponse>;
  switchNetwork: (network: NetworkType) => Promise<void>;
  availableWallets: WalletInfo[];
  refreshBalances: () => Promise<void>;
  isLoadingBalances: boolean;
}