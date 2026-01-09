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
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', onEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isDark =
    theme?.mode === 'dark' ||
    (theme?.mode === 'auto' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  const bg = theme?.modalBackground || (isDark ? '#0f0f11' : '#ffffff');
  const text = theme?.textColor || (isDark ? '#ffffff' : '#0a0a0a');
  const muted = isDark ? '#8b8b8b' : '#6b6b6b';
  const border = isDark ? '#1f1f23' : '#eaeaea';
  const hover = theme?.buttonHoverColor || (isDark ? '#1a1a1f' : '#f6f6f6');

  return (
    <>
      <style>{`
        .swk-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .swk-modal {
          width: 420px;
          max-width: 92vw;
          background: ${bg};
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
          font-family: ${theme?.fontFamily || 'Inter, system-ui, sans-serif'};
        }

        .swk-wallet {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          border-radius: 14px;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .swk-wallet:hover {
          background: ${hover};
        }

        .swk-pill {
          font-size: 12px;
          padding: 4px 10px;
          border-radius: 999px;
          background: ${theme?.primaryColor || '#6c5ce7'};
          color: white;
          font-weight: 500;
        }
      `}</style>

      <div className="swk-overlay" onClick={onClose}>
        <div className="swk-modal" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 8,
              }}
            >
              {appIcon && (
                <img
                  src={appIcon}
                  alt=""
                  style={{ width: 32, height: 32, borderRadius: 8 }}
                />
              )}
              <span style={{ color: muted, fontSize: 14 }}>
                Log in or sign up
              </span>
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 600,
                color: text,
              }}
            >
              {appName}
            </h2>
          </div>

          {/* Wallet list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {wallets.map((wallet, i) => (
              <div
                key={wallet.id}
                className="swk-wallet"
                onClick={() => onSelectWallet(wallet.id)}
              >
                <img
                  src={wallet.icon}
                  alt={wallet.name}
                  style={{ width: 36, height: 36, borderRadius: 10 }}
                />

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      color: text,
                    }}
                  >
                    {wallet.name}
                  </div>

                  {wallet.description && (
                    <div
                      style={{
                        fontSize: 13,
                        color: muted,
                        marginTop: 2,
                      }}
                    >
                      {wallet.description}
                    </div>
                  )}
                </div>

                {i === 0 && <div className="swk-pill">Recent</div>}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: 24,
              paddingTop: 16,
              borderTop: `1px solid ${border}`,
              textAlign: 'center',
              fontSize: 13,
              color: muted,
            }}
          >
            Powered by Stellar Wallet Kit
          </div>
        </div>
      </div>
    </>
  );
}
