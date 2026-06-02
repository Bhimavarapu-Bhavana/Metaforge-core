import React from 'react';
import { useApp } from '../../context/AppContext';

export const DatabaseTab: React.FC = () => {
  const { config, t } = useApp();

  if (!config || !config.entities || config.entities.length === 0) {
    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'auto', padding: '20px' }}>
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <i className="fas fa-database" style={{ fontSize: '40px', marginBottom: '16px', display: 'block' }} />
          No schema defined
        </div>
      </div>
    );
  }

  const typeColors: Record<string, string> = {
    uuid: '#c084fc',
    string: '#00e89d',
    text: '#00c080',
    integer: '#6b8aff',
    float: '#6b8aff',
    boolean: '#ff6b4a',
    datetime: '#ffaa22',
    date: '#ffaa22',
    enum: '#ff6b4a',
    json: '#888'
  };

  const totalFields = config.entities.reduce((acc, e) => acc + (e.fields?.length || 0), 0);

  const palette = ['#00e89d', '#6b8aff', '#ff6b4a', '#ffaa22', '#c084fc'];

  const constraintColors: Record<string, string> = {
    primary: '#c084fc',
    auto: '#ffaa22',
    required: '#ff6b4a',
    unique: '#6b8aff'
  };

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'auto', padding: '20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header Summary */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>
            {t('databaseSchema')}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            {config.entities.length} tables with {totalFields} total fields
          </p>
        </div>

        {/* Visual ER Diagram Flex Grid */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {config.entities.map((entity, ei) => {
            const color = palette[ei % palette.length];
            return (
              <div
                key={ei}
                style={{
                  flex: 1,
                  minWidth: '220px',
                  maxWidth: '300px',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    padding: '12px 16px',
                    background: `${color}15`,
                    borderBottom: `1px solid ${color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <i className="fas fa-table" style={{ color, fontSize: '12px' }} />
                  <span style={{ fontWeight: 700, fontSize: '14px', color }}>
                    {entity.name}
                  </span>
                  <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--text-muted)' }}>
                    {entity.fields?.length || 0} fields
                  </span>
                </div>

                <div style={{ padding: '8px' }}>
                  {entity.fields && entity.fields.map((field, fIdx) => {
                    const tc = typeColors[field.type] || '#888';
                    const isPrimary = field.constraints && field.constraints.includes('primary');
                    const isRequired = field.constraints && field.constraints.includes('required');

                    return (
                      <div
                        key={fIdx}
                        style={{
                          padding: '6px 8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '12px',
                          borderRadius: '4px',
                          background: isPrimary ? 'rgba(192,132,252,0.06)' : 'transparent'
                        }}
                      >
                        {isPrimary ? (
                          <i className="fas fa-key" style={{ color: '#c084fc', fontSize: '9px' }} />
                        ) : (
                          <span style={{ width: '9px' }} />
                        )}
                        <span
                          style={{
                            color: 'var(--text-primary)',
                            fontWeight: isRequired ? 600 : 400
                          }}
                        >
                          {field.name}
                        </span>
                        <span
                          style={{
                            marginLeft: 'auto',
                            color: tc,
                            fontSize: '10px',
                            fontWeight: 600
                          }}
                        >
                          {field.type}
                        </span>
                        {field.reference && (
                          <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                            <i className="fas fa-link" style={{ marginRight: '2px' }} />
                            {field.reference}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Schema Tables */}
        {config.entities.map((entity, ei) => {
          const hasReferences = entity.fields?.some(f => f.reference !== undefined);

          return (
            <div key={ei} style={{ marginBottom: '20px' }}>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '8px'
                }}
              >
                <i
                  className="fas fa-table"
                  style={{ color: 'var(--accent)', marginRight: '6px', fontSize: '12px' }}
                />
                {entity.name}
                <span
                  style={{
                    color: 'var(--text-muted)',
                    fontWeight: 400,
                    fontSize: '12px',
                    marginLeft: '8px'
                  }}
                >
                  table_{entity.name.toLowerCase()}s
                </span>
              </div>

              <table
                className="schema-table"
                style={{
                  width: '100%',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  borderCollapse: 'collapse'
                }}
              >
                <thead>
                  <tr>
                    <th>{t('fields')}</th>
                    <th>{t('type')}</th>
                    <th>{t('constraints')}</th>
                    {hasReferences && <th>Reference</th>}
                  </tr>
                </thead>
                <tbody>
                  {entity.fields && entity.fields.map((field, fIdx) => {
                    const typeLabel = field.options
                      ? `${field.type}(${field.options.join(',')})`
                      : field.type;

                    return (
                      <tr key={fIdx}>
                        <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                          {field.name}
                        </td>
                        <td>
                          <span
                            style={{
                              color: typeColors[field.type] || '#888',
                              fontWeight: 500
                            }}
                          >
                            {typeLabel}
                          </span>
                        </td>
                        <td>
                          {field.constraints && field.constraints.length > 0 ? (
                            field.constraints.map((c, cIdx) => {
                              const cc = constraintColors[c] || '#555';
                              return (
                                <span
                                  key={cIdx}
                                  style={{
                                    display: 'inline-block',
                                    padding: '1px 6px',
                                    borderRadius: '3px',
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    background: `${cc}20`,
                                    color: cc,
                                    marginRight: '3px'
                                  }}
                                >
                                  {t(c)}
                                </span>
                              );
                            })
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>—</span>
                          )}
                        </td>
                        {hasReferences && (
                          <td style={{ color: 'var(--text-muted)' }}>
                            {field.reference || '—'}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}

      </div>
    </div>
  );
};
