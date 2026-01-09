# 🌟 Stellar Wallet Kit

A comprehensive, production-ready wallet connection SDK for Stellar dApps.  
Built with TypeScript and React, inspired by RainbowKit.

[![npm version](https://img.shields.io/npm/v/stellar-wallet-kit.svg)](https://www.npmjs.com/package/stellar-wallet-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

---

## ✨ Features

- 🔌 **Multiple Wallet Support** – Freighter & Albedo
- 🎨 **Fully Customizable UI** – Theme control to match your brand
- ⚡ **TypeScript First** – Full type safety & IntelliSense
- 🎯 **React Hooks API** – Simple `useWallet()` hook
- 💰 **Built-in Balance Fetching**
- 💾 **Auto-reconnect** (extension wallets)
- 🌓 **Light / Dark / Auto theme**
- 🔄 **Auto-refresh balances**
- 🚀 **Framework-agnostic SDK**
- 📱 **Next.js compatible**
- 🎪 **Beautiful Wallet Modal**

---

## 📦 Installation

```bash
npm install stellar-wallet-kit
# or
yarn add stellar-wallet-kit
# or
pnpm add stellar-wallet-kit
````

---

## 🚀 Quick Start

### 1️⃣ Wrap your app with `WalletProvider`

```tsx
import { WalletProvider, NetworkType } from 'stellar-wallet-kit';

export function App() {
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

---

### 2️⃣ Add the Connect Button

```tsx
import { ConnectButton } from 'stellar-wallet-kit';

export function Header() {
  return <ConnectButton showBalance />;
}
```

---

### 3️⃣ Use the `useWallet()` hook

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

---

## 🔌 Supported Wallets

| Wallet        | Type              | Auto-Reconnect |
| ------------- | ----------------- | -------------- |
| **Freighter** | Browser extension | ✅              |
| **Albedo**    | Web-based (popup) | ❌              |

---

## 🌐 Albedo Wallet Integration (Important)

Albedo is a **web-based wallet**, not a browser extension.

Because of this, it **cannot inject APIs** into your app and **requires a callback route** to return results.

This is **intentional and secure by design**.

---

### 🧠 How Albedo Works

1. Your app opens Albedo in a popup
2. User approves the action in Albedo
3. Albedo redirects the popup to a callback URL
4. The callback sends data back to your app
5. The popup closes and the wallet is connected

If the callback route is missing, **Albedo will open but never connect**.

---

## ⚠️ Required: Add an Albedo Callback Route (App-side)

Because this SDK is **framework-agnostic**, it **cannot create routes for you**.

Your app **must define** a callback route.

---

### Example: Next.js (Pages Router)

```tsx
// pages/albedo-callback.tsx
import { useEffect } from 'react';

export default function AlbedoCallback() {
  useEffect(() => {
    const params = Object.fromEntries(
      new URLSearchParams(window.location.search)
    );

    if (window.opener) {
      window.opener.postMessage(
        { type: 'ALBEDO_RESULT', payload: params },
        window.location.origin
      );
    }

    window.close();
  }, []);

  return <p>Connecting wallet…</p>;
}
```

---

### Example: Next.js (App Router)

```tsx
// app/albedo-callback/page.tsx
'use client';

import { useEffect } from 'react';

export default function AlbedoCallback() {
  useEffect(() => {
    const params = Object.fromEntries(
      new URLSearchParams(window.location.search)
    );

    if (window.opener) {
      window.opener.postMessage(
        { type: 'ALBEDO_RESULT', payload: params },
        window.location.origin
      );
    }

    window.close();
  }, []);

  return <p>Connecting wallet…</p>;
}
```

---

### Example: React Router

```tsx
function AlbedoCallback() {
  useEffect(() => {
    const params = Object.fromEntries(
      new URLSearchParams(window.location.search)
    );

    if (window.opener) {
      window.opener.postMessage(
        { type: 'ALBEDO_RESULT', payload: params },
        window.location.origin
      );
    }

    window.close();
  }, []);

  return <p>Connecting wallet…</p>;
}
```

---

## 🔗 Connecting Explicitly to Albedo

```tsx
import { WalletType, useWallet } from 'stellar-wallet-kit';

const { connect } = useWallet();

await connect(WalletType.ALBEDO);
```

---

## 💰 Balance Utilities

```tsx
import {
  getNativeBalance,
  getAssetBalance,
  formatBalance,
  hasSufficientBalance,
} from 'stellar-wallet-kit';

const xlm = getNativeBalance(account.balances);
const usdc = getAssetBalance(account.balances, 'USDC', issuer);
```

---

## 🎨 Theme Customization

```tsx
<WalletProvider
  config={{
    theme: {
      mode: 'dark',
      primaryColor: '#8b5cf6',
      borderRadius: '16px',
    },
  }}
>
  <App />
</WalletProvider>
```

---

## 🎯 `useWallet()` API

```tsx
const {
  account,
  isConnected,
  isConnecting,
  error,
  network,
  selectedWallet,
  availableWallets,

  connect,
  disconnect,
  signTransaction,
  signAuthEntry,
  switchNetwork,
  refreshBalances,

  supports,
} = useWallet();
```

---

## 🧠 Wallet Capabilities (`supports`)

```ts
supports = {
  silentReconnect: boolean;
  networkDetection: boolean;
  authEntrySigning: boolean;
}
```

Useful for conditional UI and safer flows.

---

## 📱 Next.js App Router Setup

```tsx
'use client';

import { WalletProvider } from 'stellar-wallet-kit';

export function Providers({ children }) {
  return <WalletProvider>{children}</WalletProvider>;
}
```

---

## 🐛 Troubleshooting

### Albedo popup opens but doesn’t connect

✔ Missing callback route
✔ Callback URL mismatch
✔ Popup blocked by browser

### Freighter not detected

✔ Ensure extension is installed & enabled

---

## 🗺️ Roadmap

* [x] Freighter support
* [x] Albedo support
* [x] Balance utilities
* [ ] xBull
* [ ] Rabet
* [ ] WalletConnect
* [ ] Mobile deep-link wallets
* [ ] Hardware wallets

---

## 📄 License

MIT © Tushar Pamnani

---

## 🌟 Show Your Support

If this project helps you, please ⭐️ it on GitHub.

Built with ❤️ for the Stellar ecosystem.