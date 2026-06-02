import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    t,
    addNotification,
    showToast
  } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const isLogin = authMode === 'login';

  const handleAuth = () => {
    if (!email || !password) {
      showToast('warning', 'Please fill in all fields');
      return;
    }
    setIsAuthModalOpen(false);
    addNotification('success', `${isLogin ? 'Signed in' : 'Signed up'} as ${email}`);
    showToast('success', `Welcome${isLogin ? ' back' : ''}, ${email.split('@')[0]}!`);
    
    // Reset inputs
    setEmail('');
    setPassword('');
  };

  const socialLogin = (provider: string) => {
    setIsAuthModalOpen(false);
    addNotification('info', `Authenticated via ${provider}`);
    showToast('success', `Signed in with ${provider}`);
  };

  return (
    <div
      className="modal-overlay"
      onClick={e => {
        if (e.target === e.currentTarget) setIsAuthModalOpen(false);
      }}
    >
      <div
        className="modal-content glass"
        style={{
          width: '400px',
          maxWidth: '90vw',
          borderRadius: '16px',
          overflow: 'hidden'
        }}
      >
        <div style={{ padding: '32px 28px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--accent), #00a070)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}
            >
              <i className="fas fa-cube" style={{ fontSize: '20px', color: 'var(--bg-primary)' }} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>
              {t('loginTitle')}
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {/* Google Login */}
            <button
              onClick={() => socialLogin('Google')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 16px',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              onMouseOver={e => (e.currentTarget.style.borderColor = 'var(--border-hover)')}
              onMouseOut={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {t('googleLogin')}
            </button>

            {/* GitHub Login */}
            <button
              onClick={() => socialLogin('GitHub')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 16px',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              onMouseOver={e => (e.currentTarget.style.borderColor = 'var(--border-hover)')}
              onMouseOut={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <i className="fab fa-github" style={{ fontSize: '18px' }} />
              {t('githubLogin')}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: '6px'
                }}
              >
                {t('email')}
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  outline: 'none',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.15s'
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: '6px'
                }}
              >
                {t('password')}
              </label>
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  outline: 'none',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.15s'
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              />
            </div>
          </div>

          <button
            onClick={handleAuth}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--accent)',
              color: 'var(--bg-primary)',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s',
              fontFamily: 'inherit'
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#00ffaa')}
            onMouseOut={e => (e.currentTarget.style.background = 'var(--accent)')}
          >
            {isLogin ? t('login') : t('signup')}
          </button>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {isLogin ? t('noAccount') : t('hasAccount')}
              <a
                href="#toggle"
                onClick={e => {
                  e.preventDefault();
                  setAuthMode(isLogin ? 'signup' : 'login');
                }}
                style={{
                  color: 'var(--accent)',
                  fontWeight: 600,
                  textDecoration: 'none',
                  marginLeft: '4px'
                }}
              >
                {isLogin ? t('signup') : t('login')}
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
