# Stellar Wallet Kit (DX-first)

> A **React-first, hackathon-friendly wallet adapter for Stellar**.
> No global state. No injected UI. No magic.

This package provides a **clean wallet connection layer** for Stellar apps — inspired by `wagmi` and Solana’s wallet adapter, but designed specifically for Stellar’s ecosystem and real-world frontend workflows.

---

## Why this exists

Stellar wallet tooling today is:

* tightly coupled to injected UI
* based on global mutable state
* difficult to integrate with React / Next.js
* hard to reason about in hackathons

This package fixes that by providing:

* explicit connection state
* predictable lifecycle
* framework-native APIs
* zero DOM injection

**You control the UI. We handle the wallet logic.**

---

## Features

* ✅ React-first API (`Provider + hook`)
* ✅ Explicit connection state (`isConnected`, `isConnecting`)
* ✅ Modal-based wallet selection (no injected buttons)
* ✅ Clean adapter architecture (pluggable wallets)
* ✅ Safe for Next.js / SSR (client-only execution)
* ✅ Hackathon-ready defaults
* ❌ No global singletons
* ❌ No hidden side-effects
* ❌ No forced UI

---

## Installation

```bash
pnpm add stellar-wallet-kit
# or
npm install stellar-wallet-kit
```

> This package is currently **not opinionated about wallets**.
> You choose which adapters to include.

---

## Basic Usage

### 1. Wrap your app

```tsx
"use client";

import { StellarWalletProvider } from "stellar-wallet-kit";

export default function RootLayout({ children }) {
  return (
    <StellarWalletProvider network="testnet">
      {children}
    </StellarWalletProvider>
  );
}
```

---

### 2. Use the wallet hook

```tsx
import { useStellarWallet } from "stellar-wallet-kit";

export function WalletButton() {
  const {
    address,
    isConnected,
    isConnecting,
    connect,
    disconnect,
  } = useStellarWallet();

  if (!isConnected) {
    return (
      <button onClick={connect} disabled={isConnecting}>
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </button>
    );
  }

  return (
    <button onClick={disconnect}>
      {address.slice(0, 6)}…{address.slice(-4)}
    </button>
  );
}
```

That’s it.

---

## API

### `useStellarWallet()`

```ts
const {
  address: string | null,
  isConnected: boolean,
  isConnecting: boolean,
  connect: () => Promise<void>,
  disconnect: () => Promise<void>,
  signTransaction: (xdr: string) => Promise<{ signedTxXdr: string }>,
  signMessage: (message: string) => Promise<{ signedMessage: string }>
}
```

---

### `StellarWalletProvider`

```tsx
<StellarWalletProvider
  network="testnet" // or "public"
>
  {children}
</StellarWalletProvider>
```

**Props**

* `network`: `"testnet" | "public"`

> The provider does **not** render any UI.

---

## Wallet Adapters (internal)

This package uses an **adapter-based architecture**.

Each wallet adapter implements a common interface:

```ts
export interface StellarWalletAdapter {
  id: string;
  name: string;

  isAvailable(): Promise<boolean>;
  connect(): Promise<{ address: string }>;
  disconnect(): Promise<void>;

  signTransaction(xdr: string): Promise<{ signedTxXdr: string }>;
  signMessage(message: string): Promise<{ signedMessage: string }>;
}
```

This allows:

* swapping wallet implementations
* adding new wallets incrementally
* keeping your app API stable

---

## What this package does NOT do

Intentionally excluded:

* ❌ UI components
* ❌ Wallet buttons
* ❌ Theme systems
* ❌ Global event emitters
* ❌ DOM injection

Why?

Because **apps should own UI**, not SDKs.

---

## Design principles

* **Explicit over implicit**
* **State over side-effects**
* **Adapters over globals**
* **DX over cleverness**

If something feels confusing, it’s probably wrong.

---

## SSR & Next.js

This package is **safe for Next.js** when used correctly:

* Provider must be used in a `"use client"` component
* Wallet logic is initialized lazily
* No browser APIs are touched during module import

---

## Intended use cases

* Hackathons
* DevRel starter kits
* Consumer-facing Stellar apps
* React / Next.js projects
* Teams who want predictable wallet behavior

---

## Roadmap

* [ ] Native Freighter adapter
* [ ] WalletConnect adapter
* [ ] Mobile wallet support
* [ ] Adapter auto-detection
* [ ] Example apps
* [ ] Docs site

---

## Philosophy

This package exists because:

> **Bad DX kills ecosystems faster than bad tech.**

If you’ve ever spent hours fighting wallet tooling instead of building your idea — this is for you.

---

## License

MIT

