import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { WalletModal } from './WalletModal';
import type { WalletTheme } from '../types';
import { getNativeBalance, formatBalance } from '../utils/balanceUtils';

interface ConnectButtonProps {
  label?: string;
  theme?: WalletTheme;
  className?: string;
  style?: React.CSSProperties;
  showBalance?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function ConnectButton({
  label = 'Connect Wallet',
  theme,
  className,
  style,
  showBalance = false,
  onConnect,
  onDisconnect,
}: ConnectButtonProps) {
  const {
    account,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    availableWallets,
    selectedWallet,
    refreshBalances,
    isLoadingBalances,
  } = useWallet();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const themeMode = theme?.mode || 'light';
  const isDark = themeMode === 'dark' || (themeMode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const defaultButtonStyles: React.CSSProperties = {
    padding: '12px 24px',
    borderRadius: theme?.borderRadius || '12px',
    border: 'none',
    fontSize: '15px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: theme?.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    ...style,
  };

  const connectButtonStyles: React.CSSProperties = {
    ...defaultButtonStyles,
    backgroundColor: theme?.primaryColor || '#8b5cf6',
    color: '#ffffff',
  };

  const accountButtonStyles: React.CSSProperties = {
    ...defaultButtonStyles,
    backgroundColor: isDark ? '#252525' : '#f5f5f5',
    color: theme?.textColor || (isDark ? '#ffffff' : '#000000'),
    border: `1px solid ${isDark ? '#333333' : '#e5e5e5'}`,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const dropdownStyles: React.CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    backgroundColor: theme?.modalBackground || (isDark ? '#1a1a1a' : '#ffffff'),
    border: `1px solid ${isDark ? '#333333' : '#e5e5e5'}`,
    borderRadius: theme?.borderRadius || '12px',
    padding: '8px',
    minWidth: '200px',
    boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.4)' : '0 4px 16px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
  };

  const dropdownItemStyles: React.CSSProperties = {
    padding: '12px 16px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    fontSize: '14px',
    color: theme?.textColor || (isDark ? '#ffffff' : '#000000'),
    borderRadius: '8px',
    transition: 'background-color 0.2s',
    fontFamily: 'inherit',
  };

  const handleConnect = async (walletType: any) => {
    try {
      await connect(walletType);
      setIsModalOpen(false);
      onConnect?.();
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setShowDropdown(false);
      onDisconnect?.();
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  const copyAddress = () => {
    if (account?.address) {
      navigator.clipboard.writeText(account.address);
      // You could add a toast notification here
      setShowDropdown(false);
    }
  };

  if (isConnecting) {
    return (
      <button
        className={className}
        style={connectButtonStyles}
        disabled
      >
        Connecting...
      </button>
    );
  }

  if (!isConnected || !account) {
    return (
      <>
        <button
          className={className}
          style={connectButtonStyles}
          onClick={() => setIsModalOpen(true)}
        >
          {label}
        </button>
        <WalletModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          wallets={availableWallets}
          onSelectWallet={handleConnect}
          theme={theme}
        />
      </>
    );
  }

  const walletIcon = availableWallets.find(w => w.id === selectedWallet)?.icon;
  const nativeBalance = account?.balances ? getNativeBalance(account.balances) : null;
  const formattedBalance = nativeBalance ? formatBalance(nativeBalance, 2) : null;

  return (
    <>
      <div style={{ position: 'relative' }}>
        <button
          className={className}
          style={accountButtonStyles}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {walletIcon && (
            <img
              src={walletIcon}
              alt="Wallet"
              style={{ width: '20px', height: '20px', borderRadius: '4px' }}
            />
          )}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
            <span>{account.displayName}</span>
            {showBalance && formattedBalance && (
              <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 400 }}>
                {isLoadingBalances ? '...' : `${formattedBalance} XLM`}
              </span>
            )}
          </div>
          <span style={{ fontSize: '12px', opacity: 0.7 }}>▼</span>
        </button>

        {showDropdown && (
          <>
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 999,
              }}
              onClick={() => setShowDropdown(false)}
            />
            <div style={dropdownStyles}>
              <button
                style={dropdownItemStyles}
                onClick={() => {
                  refreshBalances();
                  setShowDropdown(false);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme?.buttonHoverColor || (isDark ? '#333333' : '#f0f0f0');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                🔄 Refresh Balances
              </button>
              <button
                style={dropdownItemStyles}
                onClick={copyAddress}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme?.buttonHoverColor || (isDark ? '#333333' : '#f0f0f0');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                📋 Copy Address
              </button>
              <button
                style={{
                  ...dropdownItemStyles,
                  color: '#ef4444',
                }}
                onClick={handleDisconnect}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme?.buttonHoverColor || (isDark ? '#333333' : '#f0f0f0');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                🚪 Disconnect
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}