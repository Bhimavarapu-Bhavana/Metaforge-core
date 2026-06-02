import React from 'react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const {
    lang,
    setLang,
    setIsCsvModalOpen,
    setIsAuthModalOpen,
    setIsDeployModalOpen,
    notifications,
    unreadCount,
    resetUnreadCount,
    t
  } = useApp();

  return (
    <header
      style={{
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-primary)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #6b8aff, #00e89d)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>
            MF
          </div>
          <div style={{ fontWeight: 700 }}>{t('appName')}</div>
        </div>
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => setLang('en')} className={lang === 'en' ? 'lang-btn active' : 'lang-btn'}>EN</button>
          <button onClick={() => setLang('hi')} className={lang === 'hi' ? 'lang-btn active' : 'lang-btn'}>HI</button>
          <button onClick={() => setLang('es')} className={lang === 'es' ? 'lang-btn active' : 'lang-btn'}>ES</button>
        </div>

        <button onClick={() => setIsCsvModalOpen(true)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'none', cursor: 'pointer' }}>
          <i className="fas fa-file-csv" style={{ marginRight: '6px' }} /> {t('importCsv')}
        </button>

        <button onClick={() => setIsDeployModalOpen(true)} style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', background: 'var(--accent)', color: 'white', cursor: 'pointer' }}>
          <i className="fas fa-rocket" style={{ marginRight: '6px' }} /> {t('deployBtn')}
        </button>

        <button onClick={() => setIsAuthModalOpen(true)} style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'none', cursor: 'pointer' }}>
          <i className="fas fa-user" />
        </button>

        <button onClick={resetUnreadCount} style={{ position: 'relative', padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'none', cursor: 'pointer' }}>
          <i className="fas fa-bell" />
          {unreadCount > 0 && (
            <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ff4466', color: 'white', borderRadius: '8px', padding: '2px 6px', fontSize: '11px', fontWeight: 700 }}>
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
