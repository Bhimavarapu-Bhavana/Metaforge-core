import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Language } from '../utils/i18n';

export const Header: React.FC = () => {
  const {
    lang,
    setLang,
    t,
    unreadCount,
    resetUnreadCount,
    notifications,
    clearNotifications,
    setIsCsvModalOpen,
    setIsAuthModalOpen,
    setIsDeployModalOpen,
    showToast
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Time formatting function similar to original
  const getTimeAgo = (date: Date) => {
    const s = Math.floor((Date.now() - date.getTime()) / 1000);
    if (s < 5) return lang === 'hi' ? 'अभी' : lang === 'es' ? 'Ahora' : 'Just now';
    if (s < 60) return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    return `${Math.floor(s / 3600)}h ago`;
  };

  // Close notifications if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    if (isNotifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotifOpen]);

  const handleLangChange = (newLang: Language) => {
    setLang(newLang);
    document.documentElement.setAttribute('data-lang', newLang);
    showToast('info', `Language switched to ${newLang.toUpperCase()}`);
  };

  const toggleNotifs = () => {
    if (!isNotifOpen) {
      resetUnreadCount();
    }
    setIsNotifOpen(!isNotifOpen);
  };

  const icons = {
    success: 'fa-check-circle',
    error: 'fa-times-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  };

  const colors = {
    success: '#00e89d',
    error: '#ff4466',
    warning: '#ffaa22',
    info: '#6b8aff'
  };

  return (
    <>
      <header
        className="glass"
        style={{
          height: '56px',
          position: 'relative',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: '12px',
          borderTop: 'none',
          borderLeft: 'none',
          borderRight: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--accent), #00a070)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <i className="fas fa-cube" style={{ fontSize: '14px', color: 'var(--bg-primary)' }} />
          </div>
          <span style={{ fontWeight: 700, fontSize: '16px', letterSpacing: '-0.5px' }}>
            MetaForge
          </span>
          <span className="badge" style={{ background: 'var(--accent-glow)', color: 'var(--accent)' }}>
            v1.0
          </span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Language Switcher */}
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {(['en', 'hi', 'es'] as Language[]).map(l => (
            <button
              key={l}
              className={`lang-btn ${lang === l ? 'active' : ''}`}
              onClick={() => handleLangChange(l)}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 4px' }} />

        {/* Notifications Button */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={toggleNotifs}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              transition: 'all 0.15s'
            }}
            onMouseOver={e => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.background = 'var(--bg-tertiary)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.background = 'none';
            }}
            title={t('notifications')}
          >
            <i className="fas fa-bell" style={{ fontSize: '15px' }} />
            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Panel */}
          {isNotifOpen && (
            <div
              className="glass"
              style={{
                position: 'fixed',
                top: '57px',
                right: '16px',
                width: '340px',
                maxHeight: '400px',
                zIndex: 9000,
                borderRadius: '12px',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '14px', flex: 1 }}>
                  {t('notifications')}
                </span>
                <button
                  onClick={() => {
                    clearNotifications();
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  {t('clearAll')}
                </button>
              </div>

              <div style={{ overflowY: 'auto', maxHeight: '340px' }}>
                {notifications.length === 0 ? (
                  <div
                    style={{
                      padding: '40px 20px',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                      fontSize: '13px'
                    }}
                  >
                    {t('noNotifs')}
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid rgba(42,42,58,0.5)',
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'flex-start'
                      }}
                    >
                      <i
                        className={`fas ${icons[n.type] || icons.info}`}
                        style={{
                          color: colors[n.type] || colors.info,
                          marginTop: '2px',
                          fontSize: '13px'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: '13px',
                            color: 'var(--text-primary)',
                            lineHeight: 1.4
                          }}
                        >
                          {n.message}
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: 'var(--text-muted)',
                            marginTop: '3px'
                          }}
                        >
                          {getTimeAgo(n.time)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* CSV Import */}
        <button
          onClick={() => setIsCsvModalOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '6px',
            transition: 'all 0.15s'
          }}
          onMouseOver={e => {
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.background = 'var(--bg-tertiary)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.background = 'none';
          }}
          title={t('csvImport')}
        >
          <i className="fas fa-file-csv" style={{ fontSize: '15px' }} />
        </button>

        {/* Deploy */}
        <button
          onClick={() => setIsDeployModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '8px',
            background: 'var(--accent)',
            color: 'var(--bg-primary)',
            fontSize: '13px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s'
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = '#00ffaa';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = 'var(--accent)';
          }}
        >
          <i className="fas fa-rocket" style={{ fontSize: '11px' }} />
          <span>{t('deploy')}</span>
        </button>

        {/* Auth Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            paddingLeft: '8px',
            borderLeft: '1px solid var(--border)',
            marginLeft: '4px'
          }}
        >
          <div
            onClick={() => setIsAuthModalOpen(true)}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--accent-tertiary), #4466dd)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
            title="User Profile"
          >
            U
          </div>
        </div>
      </header>
      <div className="glow-line" />
    </>
  );
};
