import React from 'react';
import { useApp } from '../../context/AppContext';

export const APITab: React.FC = () => {
  const { config, t } = useApp();

  if (!config || !config.entities || config.entities.length === 0) {
    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'auto', padding: '20px' }}>
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <i className="fas fa-plug" style={{ fontSize: '40px', marginBottom: '16px', display: 'block' }} />
          No entities defined
        </div>
      </div>
    );
  }

  const methodColors: Record<string, { bg: string; color: string }> = {
    GET: { bg: 'rgba(0,232,157,0.1)', color: '#00e89d' },
    POST: { bg: 'rgba(107,138,255,0.1)', color: '#6b8aff' },
    PUT: { bg: 'rgba(255,170,34,0.1)', color: '#ffaa22' },
    DELETE: { bg: 'rgba(255,68,102,0.1)', color: '#ff4466' },
    PATCH: { bg: 'rgba(192,132,252,0.1)', color: '#c084fc' }
  };

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'auto', padding: '20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>
            {t('apiEndpoints')}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            {config.entities.length * 5} endpoints auto-generated from {config.entities.length} entities
          </p>
        </div>

        {config.entities.map((entity, eIdx) => {
          const endpoints = [
            {
              method: 'GET',
              path: `/api/${entity.name.toLowerCase()}s`,
              desc: `List all ${entity.name}s with pagination and filtering`
            },
            {
              method: 'GET',
              path: `/api/${entity.name.toLowerCase()}s/:id`,
              desc: `Get a single ${entity.name} by ID`
            },
            {
              method: 'POST',
              path: `/api/${entity.name.toLowerCase()}s`,
              desc: `Create a new ${entity.name}`
            },
            {
              method: 'PUT',
              path: `/api/${entity.name.toLowerCase()}s/:id`,
              desc: `Update an existing ${entity.name}`
            },
            {
              method: 'DELETE',
              path: `/api/${entity.name.toLowerCase()}s/:id`,
              desc: `Delete a ${entity.name}`
            }
          ];

          return (
            <div key={eIdx} style={{ marginBottom: '20px' }}>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <i className="fas fa-cube" style={{ color: 'var(--accent)', fontSize: '12px' }} />
                {entity.name}
              </div>

              <div
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}
              >
                {endpoints.map((ep, i) => {
                  const mc = methodColors[ep.method] || { bg: '#333', color: '#fff' };
                  return (
                    <div
                      key={i}
                      style={{
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                        transition: 'background 0.15s'
                      }}
                      onMouseOver={e => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
                      onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span
                        className="api-method"
                        style={{
                          background: mc.bg,
                          color: mc.color,
                          minWidth: '52px',
                          textAlign: 'center'
                        }}
                      >
                        {ep.method}
                      </span>
                      <span
                        className="mono"
                        style={{
                          fontSize: '13px',
                          color: 'var(--text-primary)',
                          flexShrink: 0
                        }}
                      >
                        {ep.path}
                      </span>
                      <span
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-muted)',
                          marginLeft: 'auto',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {ep.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
