// src/adapters/FreighterAdapter.ts

import {
  isConnected,
  isAllowed,
  setAllowed,
  getUserInfo,
  signTransaction,
  signAuthEntry,
  getNetwork,
} from '@stellar/freighter-api';

import { WalletType } from '../types';
import type {
  WalletAdapter,
  ConnectWalletResponse,
  SignTransactionResponse,
  SignAuthEntryResponse,
  SignTransactionOptions,
  SignAuthEntryOptions,
} from '../types';

export class FreighterAdapter implements WalletAdapter {
  readonly type = WalletType.FREIGHTER;

  async isAvailable(): Promise<boolean> {
    try {
      return await isConnected();
    } catch (error) {
      console.error('Error checking Freighter availability:', error);
      return false;
    }
  }

  async connect(): Promise<ConnectWalletResponse> {
    try {
      // Check if Freighter is installed
      const connected = await isConnected();
      if (!connected) {
        throw new Error('Freighter wallet is not installed');
      }

      // Check if already allowed
      const allowed = await isAllowed();
      
      if (!allowed) {
        // Request permission
        await setAllowed();
      }

      // Get user info
      const userInfo = await getUserInfo();
      
      if (!userInfo || !userInfo.publicKey) {
        throw new Error('Failed to get user information from Freighter');
      }

      return {
        address: userInfo.publicKey,
        publicKey: userInfo.publicKey,
      };
    } catch (error) {
      console.error('Error connecting to Freighter:', error);
      throw new Error(`Failed to connect to Freighter: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async disconnect(): Promise<void> {
    // Freighter doesn't have a disconnect method in the API
    // The user needs to disconnect manually from the extension
    // We just clear local state
    console.log('Freighter disconnect requested - user must disconnect from extension');
  }

  async getPublicKey(): Promise<string | null> {
    try {
      const allowed = await isAllowed();
      if (!allowed) {
        return null;
      }

      const userInfo = await getUserInfo();
      return userInfo?.publicKey || null;
    } catch (error) {
      console.error('Error getting public key:', error);
      return null;
    }
  }

  async getNetwork(): Promise<string> {
    try {
      const network = await getNetwork();
      return network;
    } catch (error) {
      console.error('Error getting network:', error);
      throw error;
    }
  }

  async signTransaction(
    xdr: string,
    options?: SignTransactionOptions
  ): Promise<SignTransactionResponse> {
    try {
      const result = await signTransaction(xdr, {
        network: options?.network,
        networkPassphrase: options?.networkPassphrase,
        accountToSign: options?.accountToSign,
      });

      if (!result || typeof result !== 'string') {
        throw new Error('Invalid response from Freighter');
      }

      return {
        signedTxXdr: result,
      };
    } catch (error) {
      console.error('Error signing transaction:', error);
      throw new Error(`Failed to sign transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async signAuthEntry(
    entryXdr: string,
    options?: SignAuthEntryOptions
  ): Promise<SignAuthEntryResponse> {
    try {
      const result = await signAuthEntry(entryXdr, {
        accountToSign: options?.accountToSign,
      });

      if (!result || typeof result !== 'string') {
        throw new Error('Invalid response from Freighter');
      }

      return {
        signedAuthEntry: result,
      };
    } catch (error) {
      console.error('Error signing auth entry:', error);
      throw new Error(`Failed to sign auth entry: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}