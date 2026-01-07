# 🌟 Stellar Wallet Kit

A comprehensive, production-ready wallet connection library for Stellar dApps. Built with TypeScript, React, and inspired by RainbowKit.

[![npm version](https://img.shields.io/npm/v/stellar-wallet-kit.svg)](https://www.npmjs.com/package/stellar-wallet-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## ✨ Features

- 🔌 **Multiple Wallet Support** - Freighter (more coming soon)
- 🎨 **Fully Customizable** - Complete theme control to match your brand
- ⚡ **TypeScript First** - Full type safety and IntelliSense support
- 🎯 **React Hooks** - Simple, intuitive API with `useWallet()`
- 💰 **Built-in Balance Checking** - Automatic balance fetching and refresh
- 💾 **Auto-reconnect** - Persists connection across sessions
- 🌓 **Dark Mode** - Built-in light/dark/auto theme support
- 🔄 **Auto-refresh Balances** - Updates every 30 seconds
- 🚀 **Zero Dependencies** - Only requires React and Stellar SDK
- 📱 **Next.js Ready** - Full App Router and SSR support
- 🎪 **Modal UI** - Beautiful, accessible wallet selection modal

## 📦 Installation

```bash
npm install stellar-wallet-kit
# or
yarn add stellar-wallet-kit
# or
pnpm add stellar-wallet-kit
```

## 🚀 Quick Start

### 1. Wrap your app with `WalletProvider`

```tsx
import { WalletProvider, NetworkType } from 'stellar-wallet-kit';

function App() {
  return (
    <WalletProvider
      config={{
        network: NetworkType.TESTNET,
        autoConnect: true,
      }}
    >
      <YourApp />
    </WalletProvider>
  );
}
```

### 2. Add the `ConnectButton`

```tsx
import { ConnectButton } from 'stellar-wallet-kit';

function Header() {
  return (
    <header>
      <h1>My Stellar dApp</h1>
      <ConnectButton showBalance />
    </header>
  );
}
```

### 3. Use the `useWallet` hook

```tsx
import { useWallet } from 'stellar-wallet-kit';

function Dashboard() {
  const { account, isConnected, signTransaction } = useWallet();

  if (!isConnected) {
    return <p>Please connect your wallet</p>;
  }

  return (
    <div>
      <p>Connected: {account.address}</p>
      <button onClick={() => signTransaction(xdr)}>
        Sign Transaction
      </button>
    </div>
  );
}
```

## 🎨 Customization

### Theme Configuration

```tsx
<WalletProvider
  config={{
    network: NetworkType.TESTNET,
    appName: "My Stellar dApp",
    appIcon: "https://myapp.com/icon.png",
    theme: {
      mode: 'dark',              // 'light' | 'dark' | 'auto'
      primaryColor: '#8b5cf6',
      backgroundColor: '#1a1a1a',
      borderRadius: '16px',
      fontFamily: 'Inter, sans-serif',
      overlayBackground: 'rgba(0, 0, 0, 0.8)',
      modalBackground: '#1a1a1a',
      textColor: '#ffffff',
      buttonHoverColor: '#252525',
    },
  }}
>
  <App />
</WalletProvider>
```

### Custom Connect Button

```tsx
<ConnectButton
  label="Connect Wallet"
  showBalance={true}
  theme={customTheme}
  onConnect={() => console.log('Connected!')}
  onDisconnect={() => console.log('Disconnected!')}
/>
```

## 💰 Balance Checking

### Automatic Balance Updates

Balances are fetched automatically:
- ✅ When wallet connects
- ✅ Every 30 seconds while connected
- ✅ When network switches
- ✅ When manually triggered

### Using Balances

```tsx
import { useWallet, getNativeBalance, formatBalance } from 'stellar-wallet-kit';

function BalanceDisplay() {
  const { account, isLoadingBalances, refreshBalances } = useWallet();

  if (!account?.balances) return null;

  const xlmBalance = getNativeBalance(account.balances);

  return (
    <div>
      <h3>{formatBalance(xlmBalance, 2)} XLM</h3>
      <button onClick={refreshBalances} disabled={isLoadingBalances}>
        {isLoadingBalances ? 'Loading...' : 'Refresh'}
      </button>
    </div>
  );
}
```

### Balance Utility Functions

```tsx
import {
  getNativeBalance,        // Get XLM balance
  formatBalance,           // Format for display
  getAssetBalance,         // Get specific asset balance
  hasSufficientBalance,    // Check if enough funds
  groupBalancesByType,     // Group balances by type
} from 'stellar-wallet-kit';

// Get XLM balance
const xlm = getNativeBalance(account.balances);

// Get custom asset balance
const usdc = getAssetBalance(account.balances, 'USDC', issuerAddress);

// Format for display
const formatted = formatBalance("1234.5678900", 2); // "1234.56"

// Check sufficient balance
const canPay = hasSufficientBalance(account.balances, '100', 'USDC');
```

## 🎯 API Reference

### `useWallet()` Hook

```tsx
const {
  // State
  account,              // Connected account with balances
  isConnected,          // Connection status
  isConnecting,         // Loading state
  isLoadingBalances,    // Balance loading state
  error,                // Error if any
  network,              // Current network
  selectedWallet,       // Selected wallet type
  availableWallets,     // List of available wallets

  // Methods
  connect,              // Connect to a wallet
  disconnect,           // Disconnect wallet
  signTransaction,      // Sign a transaction
  signAuthEntry,        // Sign authorization entry
  switchNetwork,        // Switch networks
  refreshBalances,      // Manually refresh balances
} = useWallet();
```

### Connect to Wallet

```tsx
// Connect to default/auto-detected wallet
await connect();

// Connect to specific wallet
await connect(WalletType.FREIGHTER);
```

### Sign Transaction

```tsx
const response = await signTransaction(xdr, {
  network: 'TESTNET',
  networkPassphrase: 'Test SDF Network ; September 2015',
  accountToSign: 'GXXXXXX...',
});

console.log(response.signedTxXdr);
```

### Sign Authorization Entry

```tsx
const response = await signAuthEntry(entryXdr, {
  accountToSign: 'GXXXXXX...',
});

console.log(response.signedAuthEntry);
```

## 🔧 Configuration Options

```tsx
interface StellarWalletKitConfig {
  network?: NetworkType;          // 'PUBLIC' | 'TESTNET' | 'FUTURENET' | 'STANDALONE'
  defaultWallet?: WalletType;     // Default wallet to connect
  autoConnect?: boolean;          // Auto-reconnect on page load
  theme?: WalletTheme;            // Custom theme
  appName?: string;               // Your app name
  appIcon?: string;               // Your app icon URL
}
```

## 📱 Next.js App Router Setup

The kit works seamlessly with Next.js 13+ App Router:

### 1. Create a Client Component wrapper

```tsx
// app/providers.tsx
'use client';

import { WalletProvider, NetworkType } from 'stellar-wallet-kit';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider config={{ network: NetworkType.TESTNET }}>
      {children}
    </WalletProvider>
  );
}
```

### 2. Use in your layout

```tsx
// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### 3. Mark pages using the wallet as Client Components

```tsx
// app/page.tsx
'use client';

import { useWallet, ConnectButton } from 'stellar-wallet-kit';

export default function Home() {
  const { isConnected } = useWallet();
  return <ConnectButton />;
}
```

## 🌐 Network Support

Supports all Stellar networks:

```tsx
import { NetworkType } from 'stellar-wallet-kit';

NetworkType.PUBLIC      // Mainnet
NetworkType.TESTNET     // Testnet
NetworkType.FUTURENET   // Futurenet
NetworkType.STANDALONE  // Local network
```

## 🔌 Supported Wallets

Currently supported:
- ✅ **Freighter** - Browser extension wallet

Coming soon:
- 🔜 xBull
- 🔜 Albedo
- 🔜 Rabet
- 🔜 WalletConnect

## 🛠️ Advanced Usage

### Custom Wallet Modal

```tsx
import { useState } from 'react';
import { useWallet, WalletModal } from 'stellar-wallet-kit';

function CustomConnect() {
  const [showModal, setShowModal] = useState(false);
  const { availableWallets, connect } = useWallet();

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Connect Wallet
      </button>
      
      <WalletModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        wallets={availableWallets}
        onSelectWallet={connect}
      />
    </>
  );
}
```

### Payment with Balance Check

```tsx
import { useWallet, hasSufficientBalance } from 'stellar-wallet-kit';

function PaymentForm() {
  const { account, signTransaction } = useWallet();
  const [amount, setAmount] = useState('');

  const handlePay = async () => {
    // Check balance before signing
    if (!hasSufficientBalance(account.balances, amount)) {
      alert('Insufficient balance!');
      return;
    }

    // Build and sign transaction
    const signed = await signTransaction(transactionXDR);
    // Submit to network...
  };

  return (
    <form onSubmit={handlePay}>
      <input value={amount} onChange={e => setAmount(e.target.value)} />
      <button type="submit">Pay</button>
    </form>
  );
}
```

### Error Handling

```tsx
function MyComponent() {
  const { connect, error } = useWallet();
  const [txError, setTxError] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      await connect();
    } catch (err) {
      console.error('Failed to connect:', err);
    }
  };

  return (
    <div>
      {error && <p className="error">{error.message}</p>}
      {txError && <p className="error">{txError}</p>}
      <button onClick={handleConnect}>Connect</button>
    </div>
  );
}
```

## 📊 TypeScript Support

Full TypeScript support with comprehensive types:

```tsx
import type {
  WalletAccount,
  WalletContextValue,
  AccountBalance,
  SignTransactionResponse,
  WalletTheme,
  NetworkType,
} from 'stellar-wallet-kit';
```

## 🎨 Styling

The package provides unstyled components that you can customize:

### Using Tailwind CSS

```tsx
<ConnectButton
  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
/>
```

### Using Custom Styles

```tsx
<ConnectButton
  style={{
    backgroundColor: '#8b5cf6',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '12px',
  }}
/>
```

## 🧪 Testing Transaction Signing

Generate safe test transactions:

```bash
npm install @stellar/stellar-sdk
```

```tsx
import * as StellarSdk from '@stellar/stellar-sdk';

async function generateTestTx(publicKey: string) {
  const server = new StellarSdk.Horizon.Server(
    'https://horizon-testnet.stellar.org'
  );
  
  const account = await server.loadAccount(publicKey);
  
  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.TESTNET,
  })
    .addMemo(StellarSdk.Memo.text('Test transaction'))
    .setTimeout(300)
    .build();
  
  return transaction.toXDR();
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/tusharpamnani/stellar-wallet-kit
cd stellar-wallet-kit

# Install dependencies
npm install

# Build the package
npm run build

# Run in development mode
npm run dev

# Link for local testing
npm link
```

### Adding a New Wallet

1. Create a new adapter in `src/adapters/`
2. Implement the `WalletAdapter` interface
3. Register it in `WalletContext.tsx`
4. Add metadata and icon
5. Submit a PR!

## 📝 Examples

Check out the `/example` directory for complete working examples:

- Basic wallet connection
- Balance display
- Transaction signing
- Payment forms
- Next.js integration

## 🐛 Troubleshooting

### Next.js: "You're importing a component that needs useState"
**Solution:** Add `'use client'` directive to the top of your file.

### TypeScript: Type conflicts between React versions
**Solution:** Add `"skipLibCheck": true` to your `tsconfig.json`.

### Freighter not detected
**Solution:** Make sure Freighter extension is installed and enabled in your browser.

### Balances not loading
**Solution:** Ensure your account is funded on the selected network. Use the [Stellar Laboratory](https://laboratory.stellar.org/#account-creator) to fund testnet accounts.

## 📚 Documentation

- [Freighter API Docs](https://docs.freighter.app/)
- [Stellar Docs](https://developers.stellar.org/)
- [Stellar SDK](https://stellar.github.io/js-stellar-sdk/)

## 🗺️ Roadmap

- [x] Freighter wallet support
- [x] Balance checking
- [x] Auto-reconnect
- [x] Next.js App Router support
- [ ] xBull wallet support
- [ ] Albedo wallet support
- [ ] Rabet wallet support
- [ ] WalletConnect integration
- [ ] Transaction history
- [ ] Multi-account support
- [ ] Mobile wallet support
- [ ] Hardware wallet support

## 📄 License

MIT © TusharPamnani

## 🙏 Acknowledgments

- Inspired by [RainbowKit](https://www.rainbowkit.com/)
- Built for the [Stellar](https://stellar.org/) ecosystem
- Thanks to the Stellar Developer Foundation

## 💬 Community & Support

- [GitHub Issues](https://github.com/yourusername/stellar-wallet-kit/issues)
- [Stellar Discord](https://discord.gg/stellardev)
- [Stack Exchange](https://stellar.stackexchange.com/)

## 🌟 Show Your Support

If this project helped you, please give it a ⭐️ on GitHub!

---

**Made with ❤️ for the Stellar community**