import { useState } from 'react';
import { getAccessToken, getSavedAccessToken } from '../api';

export default function SettingsPanel({
  settingsPanelRef,
  userMe,
  authEmail,
  authPassword,
  baseInput,
  authBusy,
  verifyLoading,
  settingsSaved,
  onChangeAuthEmail,
  onChangeAuthPassword,
  onChangeBaseInput,
  onRegister,
  onLogin,
  onLogout,
  onSaveSettings,
  onVerifyAuth,
}) {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoginMode) {
      onLogin();
    } else {
      onRegister();
    }
  };

  return (
    <div ref={settingsPanelRef} className="glass-panel settings-panel auth-panel">
      {!userMe ? (
        <div className="auth-container">
          <div className="auth-header">
            <h3 className="auth-title">{isLoginMode ? 'Welcome back' : 'Create an account'}</h3>
            <p className="auth-subtitle">
              {isLoginMode 
                ? 'Enter your credentials to access your workspace.' 
                : 'Sign up to start analyzing prescriptions securely.'}
            </p>
          </div>
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              className="auth-input"
              type="email"
              value={authEmail}
              onChange={(e) => onChangeAuthEmail(e.target.value)}
              placeholder="Email address"
              autoComplete="email"
              required
            />
            <input
              className="auth-input"
              type="password"
              value={authPassword}
              onChange={(e) => onChangeAuthPassword(e.target.value)}
              placeholder="Password (min 8 chars)"
              autoComplete={isLoginMode ? "current-password" : "new-password"}
              required
            />
            <button type="submit" className="btn-primary auth-submit" disabled={authBusy}>
              {authBusy ? '...' : (isLoginMode ? 'Sign In' : 'Sign Up')}
            </button>
          </form>
          
          <div className="auth-switch">
            <span className="auth-switch-text">
              {isLoginMode ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button type="button" className="btn-inline" onClick={() => setIsLoginMode(!isLoginMode)}>
              {isLoginMode ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </div>
      ) : (
        <div className="auth-container signed-in-state">
          <div className="user-avatar">{userMe.email.charAt(0).toUpperCase()}</div>
          <div className="auth-header">
            <h3 className="auth-title">Signed In</h3>
            <p className="auth-subtitle">{userMe.email}</p>
          </div>
          <button type="button" className="btn-secondary logout-btn" onClick={onLogout}>
            Sign Out
          </button>
        </div>
      )}

      <div className="dev-settings">
        <details>
          <summary className="dev-summary">Developer Settings</summary>
          <div className="dev-settings-content">
            <p className="settings-hint" style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
              Override the default API Base URL if necessary.
            </p>
            <label className="field-label">
              API Base URL
              <input
                className="field-input"
                value={baseInput}
                onChange={(e) => onChangeBaseInput(e.target.value)}
                placeholder="http://127.0.0.1:8001"
              />
            </label>
            <div className="settings-actions">
              <button type="button" className="btn-secondary btn-small" onClick={onSaveSettings}>
                Save URL
              </button>
              <button
                type="button"
                className="btn-secondary btn-small"
                onClick={onVerifyAuth}
                disabled={verifyLoading || !getAccessToken()}
              >
                {verifyLoading ? 'Checking…' : 'Test JWT'}
              </button>
              {settingsSaved && <span className="saved-toast">Saved</span>}
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
