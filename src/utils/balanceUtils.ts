// src/utils/balanceUtils.ts

import type { AccountBalance, NetworkType } from '../types';

interface HorizonBalanceRecord {
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

interface HorizonAccountResponse {
  id: string;
  account_id: string;
  sequence: string;
  balances: HorizonBalanceRecord[];
}

const HORIZON_URLS: Record<NetworkType, string> = {
  PUBLIC: 'https://horizon.stellar.org',
  TESTNET: 'https://horizon-testnet.stellar.org',
  FUTURENET: 'https://horizon-futurenet.stellar.org',
  STANDALONE: 'http://localhost:8000',
};

/**
 * Fetches account balances from Horizon
 */
export async function fetchAccountBalances(
  publicKey: string,
  network: NetworkType
): Promise<AccountBalance[]> {
  const horizonUrl = HORIZON_URLS[network];
  
  try {
    const response = await fetch(`${horizonUrl}/accounts/${publicKey}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Account not found. Make sure the account is funded.');
      }
      throw new Error(`Failed to fetch account: ${response.statusText}`);
    }
    
    const data: HorizonAccountResponse = await response.json();
    return data.balances as AccountBalance[];
  } catch (error) {
    console.error('Error fetching balances:', error);
    throw error;
  }
}

/**
 * Gets the native (XLM) balance from balances array
 */
export function getNativeBalance(balances: AccountBalance[]): string {
  const nativeBalance = balances.find(b => b.asset_type === 'native');
  return nativeBalance?.balance || '0';
}

/**
 * Formats balance for display
 */
export function formatBalance(balance: string, decimals: number = 7): string {
  const num = parseFloat(balance);
  if (isNaN(num)) return '0';
  
  // Format with specified decimals, remove trailing zeros
  return num.toFixed(decimals).replace(/\.?0+$/, '');
}

/**
 * Gets balance for a specific asset
 */
export function getAssetBalance(
  balances: AccountBalance[],
  assetCode?: string,
  assetIssuer?: string
): string {
  if (!assetCode) {
    return getNativeBalance(balances);
  }
  
  const asset = balances.find(
    b => b.asset_code === assetCode && 
         (!assetIssuer || b.asset_issuer === assetIssuer)
  );
  
  return asset?.balance || '0';
}

/**
 * Checks if account has sufficient balance for a transaction
 */
export function hasSufficientBalance(
  balances: AccountBalance[],
  requiredAmount: string,
  assetCode?: string,
  assetIssuer?: string
): boolean {
  const balance = getAssetBalance(balances, assetCode, assetIssuer);
  return parseFloat(balance) >= parseFloat(requiredAmount);
}

/**
 * Gets total account value in XLM (simplified - just returns native balance)
 * For real implementation, you'd need asset prices
 */
export function getTotalValueXLM(balances: AccountBalance[]): string {
  return getNativeBalance(balances);
}

/**
 * Groups balances by type (native, credit_alphanum4, credit_alphanum12, liquidity_pool_shares)
 */
export function groupBalancesByType(balances: AccountBalance[]) {
  return balances.reduce((acc, balance) => {
    const type = balance.asset_type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(balance);
    return acc;
  }, {} as Record<string, AccountBalance[]>);
}