import { UniversalConnector } from '@reown/appkit-universal-connector';
import type { CustomCaipNetwork } from '@reown/appkit-common';

/**
 * Stellar Testnet CAIP network
 * AppKit does not yet natively support Stellar,
 * so we widen the type intentionally.
 */
const stellarTestnet = {
  id: 'testnet',
  chainNamespace: 'stellar',
  caipNetworkId: 'stellar:testnet',
  name: 'Stellar Testnet',
  nativeCurrency: {
    name: 'XLM',
    symbol: 'XLM',
    decimals: 7,
  },
  rpcUrls: {
    default: {
      http: ['https://horizon-testnet.stellar.org'],
    },
  },
} as unknown as CustomCaipNetwork;

export async function getUniversalConnector(projectId: string) {
  return UniversalConnector.init({
    projectId,
    metadata: {
      name: 'Stellar Wallet Kit',
      description: 'Connect Stellar wallets',
      url: 'https://stellar.org',
      icons: [],
    },
    networks: [
      {
        namespace: 'stellar',
        chains: [stellarTestnet],
        methods: ['stellar_signTransaction'],
        events: [],
      },
    ],
  });
}
