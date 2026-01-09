import { WalletType } from '../types';
import type { WalletInfo } from '../types';

import freighterIcon from '../assets/freighter.svg';
import albedoIcon from '../assets/albedo.svg';

export const WALLET_REGISTRY: WalletInfo[] = [
  {
    id: WalletType.FREIGHTER,
    name: 'Freighter',
    icon: freighterIcon,
    installed: false,
    downloadUrl: 'https://www.freighter.app/',
    kind: 'extension',
    capabilities: {
      silentReconnect: true,
      networkDetection: true,
      authEntrySigning: true,
    },
  },
  {
    id: WalletType.ALBEDO,
    name: 'Albedo',
    icon: albedoIcon,
    description: 'Web-based Stellar wallet',
    installed: true,
    kind: 'web',
    capabilities: {
      silentReconnect: false,
      networkDetection: false,
      authEntrySigning: true,
    },
  },
  {
  id: WalletType.LOBSTR,
  name: 'LOBSTR',
  icon: 'https://lobstr.co/favicon.ico',
  description: 'Connect using LOBSTR mobile wallet',
  installed: true,
  kind: 'web',
  capabilities: {
    silentReconnect: false,
    networkDetection: false,
    authEntrySigning: false,
  },
}

];
