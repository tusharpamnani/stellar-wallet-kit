import type { StellarWalletAdapter } from "../types";
import type { StellarNetwork } from "../utils/network";
import { toSdkNetwork } from "../utils/network";
import { defaultModules } from "@creit-tech/stellar-wallets-kit/modules/utils";

async function loadSDK() {
  const mod = await import("@creit-tech/stellar-wallets-kit/sdk");
  return mod.StellarWalletsKit;
}

const initializedByNetwork = new Map<StellarNetwork, Promise<void>>();

async function initSWK(network: StellarNetwork) {
  if (initializedByNetwork.has(network)) {
    return initializedByNetwork.get(network)!;
  }

  const initPromise = (async () => {
    const StellarWalletsKit = await loadSDK();

    StellarWalletsKit.init({
      modules: defaultModules(),          // ✅ REQUIRED
      network: toSdkNetwork(network),     // ✅ CORRECT TYPE
    });
  })();

  initializedByNetwork.set(network, initPromise);
  await initPromise;
}

export function createSwkAdapter(
  network: StellarNetwork = "testnet"
): StellarWalletAdapter {
  const ensureInit = () => initSWK(network);

  return {
    id: "stellar-wallets-kit",
    name: "Stellar Wallets Kit",

    async isAvailable() {
      return true;
    },

    async connect() {
      await ensureInit();
      const StellarWalletsKit = await loadSDK();
      const { address } = await StellarWalletsKit.authModal();
      return { address };
    },

    async disconnect() {
      try {
        const StellarWalletsKit = await loadSDK();
        await StellarWalletsKit.disconnect();
      } catch {
        // best-effort
      }
    },

    async signTransaction(xdr: string) {
      await ensureInit();
      const StellarWalletsKit = await loadSDK();
      const res = await StellarWalletsKit.signTransaction(xdr);
      return { signedTxXdr: res.signedTxXdr };
    },

    async signMessage(message: string) {
      await ensureInit();
      const StellarWalletsKit = await loadSDK();
      const res = await StellarWalletsKit.signMessage(message);
      return { signedMessage: res.signedMessage };
    },
  };
}
