import { WalletType, WalletAdapter } from '../types';
import { FreighterAdapter } from '../adapters/FreighterAdapter';
import { AlbedoAdapter } from '../adapters/AlbedoAdapter';
import { WalletConnectAdapter } from '../adapters/WalletConnectAdapter';

export function createWalletAdapters(config: {
  walletConnectProjectId?: string;
}): Partial<Record<WalletType, WalletAdapter>> {
  return {
    // Extension wallet
    [WalletType.FREIGHTER]: new FreighterAdapter(),

    // Web wallet
    [WalletType.ALBEDO]: new AlbedoAdapter(),

    // WalletConnect (mobile wallets like Lobstr)
    ...(config.walletConnectProjectId
      ? {
          [WalletType.WALLETCONNECT]: new WalletConnectAdapter(
            config.walletConnectProjectId
          ),
        }
      : {}),
  };
}
