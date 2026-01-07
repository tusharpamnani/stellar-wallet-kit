import React, { useEffect } from 'react';
import type { ModalProps } from '../types';

export function WalletModal({
  isOpen,
  onClose,
  wallets,
  onSelectWallet,
  theme,
  appName = 'Your App',
  appIcon,
}: ModalProps) {
  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const themeMode = theme?.mode || 'light';
  const isDark = themeMode === 'dark' || (themeMode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const styles = {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme?.overlayBackground || (isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)'),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      animation: 'swk-fade-in 0.2s ease-out',
    },
    modal: {
      backgroundColor: theme?.modalBackground || (isDark ? '#1a1a1a' : '#ffffff'),
      borderRadius: theme?.borderRadius || '16px',
      padding: '24px',
      maxWidth: '420px',
      width: '90%',
      maxHeight: '80vh',
      overflowY: 'auto' as const,
      boxShadow: isDark ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
      animation: 'swk-slide-up 0.3s ease-out',
      fontFamily: theme?.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px',
    },
    title: {
      fontSize: '20px',
      fontWeight: 600,
      color: theme?.textColor || (isDark ? '#ffffff' : '#000000'),
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      padding: '4px',
      color: theme?.textColor || (isDark ? '#888888' : '#666666'),
      transition: 'color 0.2s',
      lineHeight: 1,
    },
    walletList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px',
    },
    walletButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '16px',
      border: `1px solid ${isDark ? '#333333' : '#e5e5e5'}`,
      borderRadius: theme?.borderRadius || '12px',
      background: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      width: '100%',
      textAlign: 'left' as const,
      fontFamily: 'inherit',
    },
    walletIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '8px',
      flexShrink: 0,
    },
    walletInfo: {
      flex: 1,
    },
    walletName: {
      fontSize: '16px',
      fontWeight: 500,
      color: theme?.textColor || (isDark ? '#ffffff' : '#000000'),
      margin: 0,
      marginBottom: '4px',
    },
    walletDescription: {
      fontSize: '13px',
      color: theme?.textColor || (isDark ? '#888888' : '#666666'),
      margin: 0,
    },
    badge: {
      padding: '4px 8px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: 500,
      flexShrink: 0,
    },
    installedBadge: {
      backgroundColor: theme?.primaryColor || (isDark ? '#4CAF50' : '#4CAF50'),
      color: '#ffffff',
    },
    notInstalledBadge: {
      backgroundColor: isDark ? '#333333' : '#f0f0f0',
      color: isDark ? '#888888' : '#666666',
    },
    footer: {
      marginTop: '24px',
      paddingTop: '16px',
      borderTop: `1px solid ${isDark ? '#333333' : '#e5e5e5'}`,
      fontSize: '13px',
      color: isDark ? '#888888' : '#666666',
      textAlign: 'center' as const,
    },
    link: {
      color: theme?.primaryColor || '#8b5cf6',
      textDecoration: 'none',
    },
  };

  const handleWalletClick = (wallet: any) => {
    if (wallet.installed) {
      onSelectWallet(wallet.id);
    } else if (wallet.downloadUrl) {
      window.open(wallet.downloadUrl, '_blank');
    }
  };

  return (
    <>
      <style>{`
        @keyframes swk-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes swk-slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .swk-wallet-button:hover {
          background-color: ${theme?.buttonHoverColor || (isDark ? '#252525' : '#f5f5f5')} !important;
          border-color: ${theme?.primaryColor || '#8b5cf6'} !important;
        }
        .swk-close-button:hover {
          color: ${theme?.primaryColor || '#8b5cf6'} !important;
        }
      `}</style>
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div style={styles.header}>
            <h2 style={styles.title}>
              {appIcon && <img src={appIcon} alt="" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />}
              Connect Wallet
            </h2>
            <button
              className="swk-close-button"
              style={styles.closeButton}
              onClick={onClose}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>

          <div style={styles.walletList}>
            {wallets.map((wallet) => (
              <button
                key={wallet.id}
                className="swk-wallet-button"
                style={styles.walletButton}
                onClick={() => handleWalletClick(wallet)}
                disabled={!wallet.installed && !wallet.downloadUrl}
              >
                <img
                  src={wallet.icon}
                  alt={`${wallet.name} icon`}
                  style={styles.walletIcon}
                />
                <div style={styles.walletInfo}>
                  <p style={styles.walletName}>{wallet.name}</p>
                  {wallet.description && (
                    <p style={styles.walletDescription}>{wallet.description}</p>
                  )}
                </div>
                <div
                  style={{
                    ...styles.badge,
                    ...(wallet.installed ? styles.installedBadge : styles.notInstalledBadge),
                  }}
                >
                  {wallet.installed ? 'Installed' : 'Get'}
                </div>
              </button>
            ))}
          </div>

          <div style={styles.footer}>
            <p style={{ margin: 0 }}>
              Don't have a wallet?{' '}
              <a
                href="https://www.stellar.org/ecosystem/projects#wallets"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                Learn more
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}