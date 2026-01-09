"use client";

import {
  ConnectButton,
  useWallet,
  formatBalance,
  getNativeBalance,
} from "stellar-wallet-kit";

export default function Home() {
  const {
    account,
    isConnected,
    isConnecting,
    network,
    isLoadingBalances,
    refreshBalances,
  } = useWallet();

  const nativeBalance = account?.balances
    ? getNativeBalance(account.balances)
    : "0";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0c0f",
        color: "#ffffff",
        fontFamily: "Inter, system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top bar */}
      <header
        style={{
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ fontWeight: 600, letterSpacing: "-0.3px" }}>
          Stellar Wallet Kit
        </div>

        <ConnectButton />
      </header>

      {/* Main */}
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
        }}
      >
        {!isConnected ? (
          /* ---------- CONNECT STATE ---------- */
          <div
            style={{
              maxWidth: 420,
              width: "100%",
              textAlign: "center",
            }}
          >
            <h1
              style={{
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: "-0.6px",
                marginBottom: 12,
              }}
            >
              Connect your wallet
            </h1>

            <p
              style={{
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.6,
                fontSize: 15,
                marginBottom: 28,
              }}
            >
              Securely connect a Stellar wallet to continue.
              No approvals happen without your confirmation.
            </p>

            <div style={{ marginBottom: 24 }}>
              <ConnectButton label="Continue" />
            </div>

            <div
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.45)",
              }}
            >
              Supports Freighter & Albedo
            </div>
          </div>
        ) : (
          /* ---------- CONNECTED STATE ---------- */
          <div
            style={{
              maxWidth: 520,
              width: "100%",
              background: "#121318",
              borderRadius: 20,
              padding: 28,
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            }}
          >
            {/* Balance */}
            <div style={{ marginBottom: 28 }}>
              <div
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: 6,
                }}
              >
                Total balance
              </div>

              <div
                style={{
                  fontSize: 42,
                  fontWeight: 600,
                  letterSpacing: "-1px",
                }}
              >
                {isLoadingBalances
                  ? "—"
                  : formatBalance(nativeBalance, 2)}{" "}
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  XLM
                </span>
              </div>
            </div>

            {/* Meta */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginBottom: 24,
              }}
            >
              <Meta label="Network" value={network} />
              <Meta
                label="Account"
                value={`${account?.publicKey.slice(
                  0,
                  6
                )}…${account?.publicKey.slice(-4)}`}
              />
            </div>

            {/* Actions */}
            <button
              onClick={refreshBalances}
              disabled={isLoadingBalances}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 12,
                background: "#1e1f26",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#ffffff",
                cursor: isLoadingBalances ? "not-allowed" : "pointer",
                fontSize: 14,
              }}
            >
              {isLoadingBalances ? "Refreshing…" : "Refresh balance"}
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: 20,
          textAlign: "center",
          fontSize: 13,
          color: "rgba(255,255,255,0.4)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        Built with Stellar Wallet Kit
      </footer>

      {/* Connecting overlay */}
      {isConnecting && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
          }}
        >
          <div
            style={{
              padding: 24,
              background: "#121318",
              borderRadius: 16,
              fontSize: 14,
            }}
          >
            Connecting wallet…
          </div>
        </div>
      )}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 14,
        background: "#181a20",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.5)",
          marginBottom: 6,
          textTransform: "uppercase",
          letterSpacing: "0.6px",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 14, fontWeight: 500 }}>{value}</div>
    </div>
  );
}
