import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function AuthScreen({ mode }) {
  const isLogin = mode === 'login';
  const { authBusy, login, register } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }
    if (!isLogin && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      if (isLogin) await login(email, password);
      else await register(email, password);
      navigate('/', { replace: true });
    } catch (authError) {
      setError(authError.message || (isLogin ? 'Login failed' : 'Registration failed'));
    }
  };

  return (
    <main className="auth-page">
      <Link to="/login" className="auth-brand" aria-label="MediScan AI">
        <span className="auth-brand-icon">M</span>
        <span>MediScan <strong>AI</strong></span>
      </Link>

      <div className="auth-shell">
        <section className="auth-showcase">
          <div className="auth-orbit" aria-hidden="true">
            <span>✦</span>
            <span>+</span>
            <span>✧</span>
            <div className="auth-orbit-core">Rx</div>
          </div>
          <p className="auth-eyebrow">AI-POWERED PRESCRIPTION INTELLIGENCE</p>
          <h1>Make every prescription easier to understand.</h1>
          <p className="auth-showcase-copy">
            Turn prescription images into clear, structured medicine details in seconds.
          </p>
          <div className="auth-feature">
            <span>01</span> Secure prescription workspace
          </div>
          <div className="auth-feature">
            <span>02</span> Clear medicine and dosage details
          </div>
        </section>

        <section className="auth-card">
          <div className="auth-header">
            <p className="auth-card-kicker">{isLogin ? 'YOUR WORKSPACE' : 'GET STARTED'}</p>
            <h2 className="auth-title">{isLogin ? 'Welcome back' : 'Create your account'}</h2>
            <p className="auth-subtitle">
              {isLogin
                ? 'Sign in to continue to your prescription workspace.'
                : 'Create an account to securely save your prescriptions.'}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span>Email address</span>
              <input
                className="auth-input"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>
            <label className="auth-field">
              <span>Password</span>
              <input
                className="auth-input"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={isLogin ? 'Enter your password' : 'At least 6 characters'}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                minLength={isLogin ? undefined : 6}
                required
              />
            </label>

            {location.state?.message && (
              <p className="auth-notice" role="status">{location.state.message}</p>
            )}
            {error && <p className="error-banner auth-error" role="alert">{error}</p>}

            <button type="submit" className="btn-primary auth-submit" disabled={authBusy}>
              {authBusy ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'}
              {!authBusy && <span aria-hidden="true">→</span>}
            </button>
          </form>

          <p className="auth-switch">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <Link to={isLogin ? '/register' : '/login'}>
              {isLogin ? 'Create one' : 'Sign in'}
            </Link>
          </p>
          <p className="auth-security">Your workspace is private and account-protected.</p>
        </section>
      </div>

      <p className="auth-footer">MEDISCAN AI · PRESCRIPTION WORKSPACE</p>
    </main>
  );
}
