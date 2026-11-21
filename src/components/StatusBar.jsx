export default function StatusBar({
  healthOk,
  versionInfo,
  verifyOk,
  userEmail,
  onLogout,
}) {
  return (
    <header className="status-bar glass-panel status-bar-inner">
      <div className="app-brand">
        <span className="app-brand-icon">M</span>
        <span>MediScan <strong>AI</strong></span>
      </div>
      <div className="status-chips">
        <span
          className={`chip ${healthOk === true ? 'chip-ok' : healthOk === false ? 'chip-bad' : 'chip-pending'}`}
        >
          API {healthOk === true ? 'online' : healthOk === false ? 'offline' : '…'}
        </span>
        {versionInfo && (
          <span className="chip chip-muted">
            v{versionInfo.version}
          </span>
        )}
        {verifyOk === true && <span className="chip chip-ok">Auth OK</span>}
      </div>
      <div className="app-account">
        <span className="app-user-email" title={userEmail}>{userEmail}</span>
        <button type="button" className="btn-ghost" onClick={onLogout}>Sign out</button>
      </div>
    </header>
  );
}
