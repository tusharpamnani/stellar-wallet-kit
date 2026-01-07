"use client"
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

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column' as const,
    },
    header: {
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%',
      padding: '24px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderRadius: '16px',
      backdropFilter: 'blur(20px)',
      marginBottom: '40px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    title: {
      color: 'white',
      fontSize: '26px',
      fontWeight: 600,
      margin: 0,
      letterSpacing: '-0.5px',
    },
    main: {
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%',
      flex: 1,
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '40px',
      marginBottom: '24px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(0, 0, 0, 0.05)',
    },
    cardTitle: {
      fontSize: '24px',
      fontWeight: 600,
      marginBottom: '24px',
      color: '#1e293b',
      letterSpacing: '-0.5px',
    },
    infoGrid: {
      display: 'grid',
      gap: '20px',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    },
    infoItem: {
      padding: '20px 24px',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
      border: '1px solid #e2e8f0',
      transition: 'all 0.2s ease',
    },
    label: {
      fontSize: '11px',
      fontWeight: 600,
      color: '#64748b',
      textTransform: 'uppercase' as const,
      letterSpacing: '1px',
    },
    value: {
      fontSize: '15px',
      color: '#1e293b',
      wordBreak: 'break-all' as const,
      fontFamily: '"SF Mono", Monaco, "Cascadia Code", monospace',
      fontWeight: 500,
    },
    welcomeText: {
      color: '#475569',
      marginBottom: '28px',
      lineHeight: '1.7',
      fontSize: '16px',
    },
    featureBox: {
      padding: '28px',
      backgroundColor: '#f1f5f9',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
    },
    featureTitle: {
      margin: '0 0 16px 0',
      color: '#1e293b',
      fontSize: '18px',
      fontWeight: 600,
    },
    featureList: {
      margin: 0,
      paddingLeft: '24px',
      color: '#475569',
      lineHeight: '2',
    },
    featureItem: {
      marginBottom: '8px',
      fontSize: '15px',
    },
    loadingCard: {
      textAlign: 'center' as const,
      color: '#64748b',
      fontSize: '15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
    },
    spinner: {
      width: '20px',
      height: '20px',
      border: '3px solid #e2e8f0',
      borderTop: '3px solid #64748b',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    balanceCard: {
      background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
      borderRadius: '20px',
      padding: '32px',
      marginBottom: '24px',
      color: 'white',
      boxShadow: '0 20px 60px rgba(139, 92, 246, 0.3)',
    },
    balanceHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '24px',
    },
    balanceLabel: {
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: '8px',
      fontWeight: 500,
    },
    balanceAmount: {
      fontSize: '48px',
      fontWeight: 700,
      letterSpacing: '-1px',
      marginBottom: '4px',
    },
    balanceCurrency: {
      fontSize: '16px',
      color: 'rgba(255, 255, 255, 0.7)',
      fontWeight: 500,
    },
    refreshButton: {
      padding: '10px 20px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      borderRadius: '10px',
      color: 'white',
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s',
      backdropFilter: 'blur(10px)',
    },
    balanceStats: {
      display: 'flex',
      gap: '32px',
      paddingTop: '24px',
      borderTop: '1px solid rgba(255, 255, 255, 0.2)',
    },
    statItem: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '4px',
    },
    statLabel: {
      fontSize: '12px',
      color: 'rgba(255, 255, 255, 0.7)',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
    },
    statValue: {
      fontSize: '18px',
      fontWeight: 600,
    },
    assetsSection: {
      marginTop: '24px',
    },
    assetsSectionTitle: {
      fontSize: '14px',
      fontWeight: 600,
      color: '#64748b',
      textTransform: 'uppercase' as const,
      letterSpacing: '1px',
      marginBottom: '16px',
    },
    assetItem: {
      padding: '16px 20px',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px',
      border: '1px solid #e2e8f0',
    },
    assetInfo: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '4px',
    },
    assetCode: {
      fontSize: '16px',
      fontWeight: 600,
      color: '#1e293b',
    },
    assetIssuer: {
      fontSize: '12px',
      color: '#64748b',
      fontFamily: '"SF Mono", Monaco, monospace',
    },
    assetBalance: {
      fontSize: '18px',
      fontWeight: 600,
      color: '#1e293b',
    },
    emptyState: {
      textAlign: 'center' as const,
      padding: '32px',
      color: '#94a3b8',
      fontSize: '14px',
    },
    footer: {
      maxWidth: '1200px',
      margin: '40px auto 0',
      width: '100%',
      padding: '24px',
      textAlign: 'center' as const,
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '14px',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    },
    footerText: {
      margin: 0,
      fontWeight: 400,
      letterSpacing: '0.3px',
    },
  };

  const nativeBalance = account?.balances ? getNativeBalance(account.balances) : '0';
  const otherBalances = account?.balances?.filter(b => b.asset_type !== 'native') || [];
  const assetCount = account?.balances?.length || 0;

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>✨ Stellar Wallet Kit</h1>
        <ConnectButton 
          label="Connect Wallet"
          onConnect={() => console.log('Wallet connected!')}
          onDisconnect={() => console.log('Wallet disconnected!')}
        />
      </header>

      <main style={styles.main}>
        {/* Connection Status */}
        {!isConnected ? (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Welcome</h2>
            <p style={styles.welcomeText}>
              Connect your Stellar wallet to access this professional dApp interface and explore the full capabilities of blockchain integration.
            </p>
            <div style={styles.featureBox}>
              <h3 style={styles.featureTitle}>Platform Features</h3>
              <ul style={styles.featureList}>
                <li style={styles.featureItem}>Seamless Freighter wallet integration</li>
                <li style={styles.featureItem}>Real-time account information & network status</li>
                <li style={styles.featureItem}>Live balance tracking and asset management</li>
                <li style={styles.featureItem}>Enterprise-grade interface design</li>
              </ul>
            </div>
          </div>
        ) : (
          <>
            {/* Balance Card */}
            {account?.balances && (
              <div style={styles.balanceCard}>
                <div style={styles.balanceHeader}>
                  <div>
                    <div style={styles.balanceLabel}>Total Balance</div>
                    <div style={styles.balanceAmount}>
                      {isLoadingBalances ? '...' : formatBalance(nativeBalance, 2)}
                    </div>
                    <div style={styles.balanceCurrency}>XLM</div>
                  </div>
                  <button
                    onClick={refreshBalances}
                    disabled={isLoadingBalances}
                    style={{
                      ...styles.refreshButton,
                      opacity: isLoadingBalances ? 0.5 : 1,
                      cursor: isLoadingBalances ? 'not-allowed' : 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoadingBalances) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                    }}
                  >
                    {isLoadingBalances ? '...' : '🔄 Refresh'}
                  </button>
                </div>
                
                <div style={styles.balanceStats}>
                  <div style={styles.statItem}>
                    <span style={styles.statLabel}>Assets</span>
                    <span style={styles.statValue}>{assetCount}</span>
                  </div>
                  <div style={styles.statItem}>
                    <span style={styles.statLabel}>Network</span>
                    <span style={styles.statValue}>{network}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Account Information */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Account Overview</h2>
              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <span style={styles.label}>Public Key</span>
                  <span style={styles.value}>{account?.publicKey}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.label}>Network</span>
                  <span style={styles.value}>{network}</span>
                </div>
              </div>
            </div>

            {/* Other Assets */}
            {account?.balances && (
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Assets</h2>
                
                {otherBalances.length > 0 ? (
                  <div style={styles.assetsSection}>
                    {otherBalances.map((balance, index) => (
                      <div key={index} style={styles.assetItem}>
                        <div style={styles.assetInfo}>
                          <div style={styles.assetCode}>
                            {balance.asset_code || 'Unknown Asset'}
                          </div>
                          {balance.asset_issuer && (
                            <div style={styles.assetIssuer}>
                              {balance.asset_issuer.slice(0, 8)}...{balance.asset_issuer.slice(-8)}
                            </div>
                          )}
                        </div>
                        <div style={styles.assetBalance}>
                          {formatBalance(balance.balance, 2)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={styles.emptyState}>
                    No other assets found in your wallet
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Loading State */}
        {isConnecting && (
          <div style={styles.card}>
            <div style={styles.loadingCard}>
              <div style={styles.spinner}></div>
              <span>Connecting to wallet...</span>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          Made with ❤️ by Tushar Pamnani
        </p>
      </footer>
    </div>
  );
}