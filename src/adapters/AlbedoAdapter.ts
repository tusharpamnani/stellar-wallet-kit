import type {
  ConnectWalletResponse,
  SignTransactionResponse,
  SignAuthEntryResponse,
  SignTransactionOptions,
  SignAuthEntryOptions,
} from "../types";
import { WalletType } from "../types";
import {
  waitForAlbedoPopup,
  waitForAlbedoResult,
} from "../utils/albedoCallback";
import { openAlbedoPopup } from "../utils/albedoCallback";

export class AlbedoAdapter {
  readonly type = WalletType.ALBEDO;

  async isAvailable(): Promise<boolean> {
    return typeof window !== "undefined";
  }

  async connect(): Promise<ConnectWalletResponse> {
    const url = new URL("https://albedo.link");

    url.searchParams.set("intent", "public-key");
    url.searchParams.set("app_name", "Stellar Wallet Kit");
    url.searchParams.set("network", "testnet");
    url.searchParams.set(
      "callback",
      `${window.location.origin}/albedo-callback`
    );
    url.searchParams.set("origin", window.location.origin);

    openAlbedoPopup(url.toString());

    const result = await waitForAlbedoPopup();

    if (!result.pubkey) {
      throw new Error("Albedo connection rejected");
    }

    return {
      address: result.pubkey,
      publicKey: result.pubkey,
    };
  }

  async disconnect() {}

  async getPublicKey(): Promise<string | null> {
    return null;
  }

  async getNetwork(): Promise<string> {
    throw new Error("Albedo does not expose network");
  }

  async signTransaction(
    xdr: string,
    _options?: SignTransactionOptions
  ): Promise<SignTransactionResponse> {
    const url = new URL("https://albedo.link");

    url.searchParams.set("intent", "tx");
    url.searchParams.set("xdr", xdr);
    url.searchParams.set("app_name", "Stellar Wallet Kit");
    url.searchParams.set("network", "testnet");
    url.searchParams.set("callback", window.location.href);
    url.searchParams.set("origin", window.location.origin);

    window.location.href = url.toString();

    const result = await waitForAlbedoResult();

    if (!result.signed_envelope_xdr) {
      throw new Error("Albedo signing rejected");
    }

    return { signedTxXdr: result.signed_envelope_xdr };
  }

  async signAuthEntry(
    entryXdr: string,
    _options?: SignAuthEntryOptions
  ): Promise<SignAuthEntryResponse> {
    const url = new URL("https://albedo.link");

    url.searchParams.set("intent", "sign-auth-entry");
    url.searchParams.set("xdr", entryXdr);
    url.searchParams.set("app_name", "Stellar Wallet Kit");
    url.searchParams.set("network", "testnet");
    url.searchParams.set("callback", window.location.href);
    url.searchParams.set("origin", window.location.origin);

    window.location.href = url.toString();

    const result = await waitForAlbedoResult();

    if (!result.signed_xdr) {
      throw new Error("Albedo auth entry rejected");
    }

    return { signedAuthEntry: result.signed_xdr };
  }
}
