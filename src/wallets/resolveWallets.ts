import type { WalletInfo } from '../types';
import { WALLET_REGISTRY } from './registry';
import { FreighterAdapter } from '../adapters/FreighterAdapter';

export async function resolveWallets(): Promise<WalletInfo[]> {
  return Promise.all(
    WALLET_REGISTRY.map(async (wallet) => {
      // Web wallets (Albedo) are always available
      if (wallet.kind === 'web') {
        return {
          ...wallet,
          installed: true,
        };
      }

      // Extension wallets need detection
      if (wallet.kind === 'extension') {
        let installed = false;

        switch (wallet.id) {
          case 'freighter':
            installed = await new FreighterAdapter().isAvailable();
            break;

          // future extension wallets go here
          // case 'xbull':
          //   installed = await new XbullAdapter().isAvailable();
          //   break;
        }

        return {
          ...wallet,
          installed,
        };
      }

      // Safe fallback
      return {
        ...wallet,
        installed: false,
      };
    })
  );
}
