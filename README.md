# 🌟 Stellar Wallet Kit

A **production-ready wallet connection SDK** for Stellar dApps.
Built with **TypeScript + React**, inspired by RainbowKit — but designed for the **realities of Stellar wallets**.

[![npm version](https://img.shields.io/npm/v/stellar-wallet-kit.svg)](https://www.npmjs.com/package/stellar-wallet-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

---

## ✨ Features

* 🔌 **Multiple Wallets**

  * Freighter (extension)
  * Albedo (web popup)
  * WalletConnect (mobile wallets)
  * LOBSTR (via WalletConnect)
* 🎨 **Customizable Wallet Modal**
* ⚡ **TypeScript-first**
* 🎯 **React Hooks API**
* 💰 **Built-in balance fetching**
* 💾 **Session persistence**
* 🌓 **Light / Dark / Auto theme**
* 🔄 **Auto-refresh balances**
* 📱 **Next.js (App Router & Pages) compatible**
* 🚀 **Framework-agnostic core**

---

## 📦 Installation

```bash
npm install stellar-wallet-kit
# or
yarn add stellar-wallet-kit
# or
pnpm add stellar-wallet-kit
```

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
  return <ConnectButton />;
}
```

---

### 3️⃣ Use the `useWallet()` hook

```tsx
import { useWallet } from 'stellar-wallet-kit';

function Dashboard() {
  const { account, isConnected, signTransaction } = useWallet();

  if (!isConnected) return <p>Please connect your wallet</p>;

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

| Wallet            | Type              | Connection Model       | Auto-Reconnect |
| ----------------- | ----------------- | ---------------------- | -------------- |
| **Freighter**     | Browser extension | Injected API           | ✅              |
| **Albedo**        | Web wallet        | Popup + callback       | ❌              |
| **WalletConnect** | Mobile wallets    | QR / deep-link session | ✅              |
| **LOBSTR**        | Mobile wallet     | WalletConnect          | ✅              |

> **LOBSTR is exposed separately in the UI** but internally uses WalletConnect.

---

## 🔗 WalletConnect & LOBSTR (Important)

WalletConnect **does not block the UI** like extensions.

* QR modal stays visible
* SDK tracks `connectingWallet`
* Global loaders **do not cover** WalletConnect

This avoids the “QR hidden behind loader” problem by design.

---

### Connecting explicitly

```tsx
import { WalletType, useWallet } from 'stellar-wallet-kit';

const { connect } = useWallet();

await connect(WalletType.WALLETCONNECT);
await connect(WalletType.LOBSTR);
```

---

## 🌐 Albedo Wallet Integration (Required)

Albedo is a **web-based wallet** and **requires a callback route**.

If the callback is missing:

* Albedo opens
* User approves
* **Connection never completes**

This is expected behavior.

---

### How Albedo Works

1. App opens Albedo popup
2. User approves
3. Albedo redirects to callback URL
4. Callback posts message to opener
5. Popup closes
6. Wallet connects

---

### Required: Add a Callback Route

#### Next.js (App Router)

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

```ts
const {
  account,
  isConnected,
  isConnecting,
  connectingWallet,
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

Use this to:

* Disable unsupported actions
* Adjust UX per wallet

---

## 🐛 Troubleshooting

### WalletConnect QR stuck on “Connecting…”

✔ Mobile wallet not approved
✔ App not foregrounded on phone
✔ Session rejected in wallet

### QR hidden behind loader

✔ **Handled automatically**
WalletConnect never blocks UI

### Albedo opens but doesn’t connect

✔ Missing callback route
✔ Callback URL mismatch
✔ Popup blocked by browser

### Freighter not detected

✔ Extension not installed / disabled

---

## 🗺️ Roadmap

* [x] Freighter
* [x] Albedo
* [x] WalletConnect
* [x] LOBSTR
* [ ] xBull
* [ ] Rabet
* [ ] Multi-account support
* [ ] Hardware wallets

---

## 📄 License

MIT © **Tushar Pamnani**

---

## 🌟 Show Your Support

If this SDK saved you pain — ⭐️ it on GitHub.

Built with ❤️ for the Stellar ecosystem.