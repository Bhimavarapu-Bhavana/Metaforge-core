import React from 'react';
import { useApp } from '../../context/AppContext';

export const WorkflowsTab: React.FC = () => {
  const { config, t } = useApp();

  if (!config || !config.workflows || config.workflows.length === 0) {
    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'auto', padding: '20px' }}>
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <i className="fas fa-sitemap" style={{ fontSize: '40px', marginBottom: '16px', display: 'block' }} />
          No workflows defined
        </div>
      </div>
    );
  }

  const actionIcons: Record<string, { icon: string; color: string }> = {
    sendNotification: { icon: 'fa-bell', color: '#6b8aff' },
    validateData: { icon: 'fa-shield-alt', color: '#00e89d' },
    logActivity: { icon: 'fa-clipboard-list', color: '#ffaa22' },
    computeField: { icon: 'fa-calculator', color: '#c084fc' }
  };

  const triggerColors: Record<string, string> = {
    onCreate: '#00e89d',
    onUpdate: '#ffaa22',
    onDelete: '#ff4466'
  };

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'auto', padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>
            {t('workflows')}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            {config.workflows.length} automated workflows
          </p>
        </div>

        {config.workflows.map((wf, i) => {
          const triggerParts = (wf.trigger || '').split('.');
          const entityName = triggerParts[0] || '';
          const triggerType = triggerParts[1] || '';
          
          const tc = triggerColors[triggerType] || '#888';
          const triggerLabel = t(triggerType) || triggerType;

          return (
            <div
              key={i}
              style={{
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '16px',
                transition: 'all 0.15s'
              }}
              onMouseOver={e => (e.currentTarget.style.borderColor = 'var(--border-hover)')}
              onMouseOut={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: `${tc}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <i className="fas fa-bolt" style={{ color: tc, fontSize: '14px' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '15px' }}>{wf.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {t('workflowName')} #{i + 1}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                    {t('trigger')}:
                  </span>
                  <span
                    style={{
                      padding: '3px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      background: `${tc}15`,
                      color: tc
                    }}
                  >
                    {entityName}.{triggerLabel}
                  </span>
                </div>

                {wf.condition && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                      Condition:
                    </span>
                    <span
                      className="mono"
                      style={{
                        padding: '3px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        background: 'var(--bg-tertiary)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {wf.condition}
                    </span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                  {t('actions')}:
                </span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {wf.actions.map((action, aIdx) => {
                    const ai = actionIcons[action] || { icon: 'fa-cog', color: '#888' };
                    const label = t(action) || action;
                    return (
                      <div
                        key={aIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          background: 'var(--bg-tertiary)'
                        }}
                      >
                        <i className={`fas ${ai.icon}`} style={{ color: ai.color, fontSize: '12px' }} />
                        <span style={{ fontSize: '12px', fontWeight: 500 }}>{label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Visual Flow diagram */}
              <div
                style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0,
                  overflowX: 'auto'
                }}
              >
                <div
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: `${tc}15`,
                    border: `1px solid ${tc}30`,
                    fontSize: '12px',
                    fontWeight: 600,
                    color: tc,
                    whiteSpace: 'nowrap'
                  }}
                >
                  <i className="fas fa-bolt" style={{ marginRight: '4px' }} />
                  {triggerLabel}
                </div>

                <div style={{ width: '30px', height: '2px', background: 'var(--border)', flexShrink: 0, position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      right: '-3px',
                      top: '-3px',
                      border: 'solid var(--border)',
                      borderWidth: '0 2px 2px 0',
                      padding: '3px',
                      transform: 'rotate(-45deg)'
                    }}
                  />
                </div>

                {wf.condition && (
                  <>
                    <div
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border)',
                        fontSize: '11px',
                        color: 'var(--text-muted)',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <i className="fas fa-filter" style={{ marginRight: '4px' }} />
                      {wf.condition}
                    </div>

                    <div style={{ width: '30px', height: '2px', background: 'var(--border)', flexShrink: 0, position: 'relative' }}>
                      <div
                        style={{
                          position: 'absolute',
                          right: '-3px',
                          top: '-3px',
                          border: 'solid var(--border)',
                          borderWidth: '0 2px 2px 0',
                          padding: '3px',
                          transform: 'rotate(-45deg)'
                        }}
                      />
                    </div>
                  </>
                )}

                {wf.actions.map((action, ai) => {
                  const aInfo = actionIcons[action] || { icon: 'fa-cog', color: '#888' };
                  const isLast = ai === wf.actions.length - 1;

                  return (
                    <div key={ai} style={{ display: 'flex', alignItems: 'center' }}>
                      <div
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: `${aInfo.color}10`,
                          border: `1px solid ${aInfo.color}25`,
                          fontSize: '12px',
                          fontWeight: 500,
                          color: aInfo.color,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <i className={`fas ${aInfo.icon}`} style={{ marginRight: '4px' }} />
                        {t(action) || action}
                      </div>

                      {!isLast && (
                        <div style={{ width: '30px', height: '2px', background: 'var(--border)', flexShrink: 0, position: 'relative' }}>
                          <div
                            style={{
                              position: 'absolute',
                              right: '-3px',
                              top: '-3px',
                              border: 'solid var(--border)',
                              borderWidth: '0 2px 2px 0',
                              padding: '3px',
                              transform: 'rotate(-45deg)'
                            }}
                          />
                        </div>
                      )}
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
