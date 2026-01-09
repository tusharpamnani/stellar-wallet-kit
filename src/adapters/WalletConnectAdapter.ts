import {
  WalletAdapter,
  WalletType,
  ConnectWalletResponse,
  SignTransactionResponse,
  SignTransactionOptions,
  SignAuthEntryResponse,
  SignAuthEntryOptions,
} from '../types';

import { getUniversalConnector } from '../utils/getUniversalConnector';

export class WalletConnectAdapter implements WalletAdapter {
  readonly type = WalletType.WALLETCONNECT;

  private projectId: string;
  private connector: any | null = null;
  private session: any | null = null;

  constructor(projectId: string) {
    if (!projectId) {
      throw new Error(
        'WalletConnectAdapter requires a WalletConnect Project ID'
      );
    }
    this.projectId = projectId;
  }

  async isAvailable(): Promise<boolean> {
    return typeof window !== 'undefined';
  }

  private async getConnector() {
    if (!this.connector) {
      this.connector = await getUniversalConnector(this.projectId);
    }
    return this.connector;
  }

  async connect(): Promise<ConnectWalletResponse> {
    const connector = await this.getConnector();
    const { session } = await connector.connect();
    this.session = session;

    // stellar:testnet:GXXXX...
    const account =
      session.namespaces.stellar.accounts[0];
    const publicKey = account.split(':')[2];

    return {
      address: publicKey,
      publicKey,
    };
  }

  async disconnect(): Promise<void> {
    if (this.connector) {
      await this.connector.disconnect();
    }
    this.session = null;
  }

  async getPublicKey(): Promise<string | null> {
    if (!this.session) return null;

    const account =
      this.session.namespaces.stellar.accounts[0];
    return account.split(':')[2];
  }

  async getNetwork(): Promise<string> {
    throw new Error('Network detection not supported via WalletConnect');
  }

  async signTransaction(
    xdr: string,
    _options?: SignTransactionOptions
  ): Promise<SignTransactionResponse> {
    if (!this.connector || !this.session) {
      throw new Error('No active WalletConnect session');
    }

    const result = await this.connector.request({
      method: 'stellar_signTransaction',
      params: { xdr },
    });

    return {
      signedTxXdr: result as string,
    };
  }

  async signAuthEntry(
    _entryXdr: string,
    _options?: SignAuthEntryOptions
  ): Promise<SignAuthEntryResponse> {
    throw new Error(
      'Auth entry signing is not supported via WalletConnect'
    );
  }
}
