import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';

interface ParsedCSV {
  headers: string[];
  rows: string[][];
  fileName: string;
}

export const CSVModal: React.FC = () => {
  const {
    isCsvModalOpen,
    setIsCsvModalOpen,
    t,
    setStatusText,
    setConfigText,
    setActiveTab,
    addNotification,
    showToast
  } = useApp();

  const [csvData, setCsvData] = useState<ParsedCSV | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isCsvModalOpen) return null;

  const closeModal = () => {
    setIsCsvModalOpen(false);
    setCsvData(null);
    setIsGenerating(false);
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const processFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      showToast('error', 'Please upload a .csv file');
      return;
    }
    setStatusText(t('csvParsing'));

    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      if (!text) return;

      const lines = text.split('\n').filter(l => l.trim());
      if (lines.length < 2) {
        showToast('error', 'CSV file is empty or has no data rows');
        setStatusText('Ready');
        return;
      }

      const headers = parseCSVLine(lines[0]);
      const rows = lines.slice(1).map(l => parseCSVLine(l));

      setCsvData({ headers, rows, fileName: file.name });
      setStatusText('Ready');
      showToast('success', `Parsed ${rows.length} rows with ${headers.length} columns`);
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const generateConfig = () => {
    if (!csvData) return;

    setIsGenerating(true);
    setStatusText(t('csvGenerating'));

    setTimeout(() => {
      let baseName = csvData.fileName
        .replace('.csv', '')
        .replace(/[^a-zA-Z]/g, ' ')
        .trim();
      if (!baseName) baseName = 'Entity';

      const entityName = baseName
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join('');

      const typeMap: Record<string, string> = {
        id: 'uuid',
        email: 'string',
        name: 'string',
        title: 'string',
        description: 'text',
        phone: 'string',
        date: 'date',
        created: 'datetime',
        updated: 'datetime',
        price: 'float',
        amount: 'float',
        quantity: 'integer',
        count: 'integer',
        status: 'enum',
        type: 'enum',
        priority: 'enum',
        active: 'boolean',
        enabled: 'boolean',
        url: 'string',
        image: 'string'
      };

      const fields = csvData.headers.map((h, i) => {
        const lower = h.toLowerCase().replace(/[^a-z]/g, '');
        let type = typeMap[lower] || 'string';
        const constraints: string[] = [];

        if (lower.includes('id') && i === 0) {
          constraints.push('primary', 'auto');
        }
        if (lower.includes('email')) {
          constraints.push('unique');
        }

        if (type === 'enum') {
          const uniqueVals = Array.from(
            new Set(csvData.rows.map(r => r[i]).filter(v => v))
          );
          if (uniqueVals.length > 0 && uniqueVals.length <= 10) {
            return {
              name: h,
              type,
              options: uniqueVals,
              default: uniqueVals[0],
              constraints
            };
          }
          type = 'string';
        }

        return { name: h, type, constraints };
      });

      // Ensure there's a primary key
      if (!fields.some(f => f.constraints && f.constraints.includes('primary'))) {
        fields.unshift({
          name: 'id',
          type: 'uuid',
          constraints: ['primary', 'auto']
        });
      }

      // Ensure timestamps
      if (!fields.some(f => f.name.toLowerCase().includes('created'))) {
        fields.push({
          name: 'createdAt',
          type: 'datetime',
          constraints: ['auto']
        });
      }

      const displayCols = fields
        .filter(f => !['id', 'createdAt'].includes(f.name))
        .map(f => f.name);

      const newConfig = {
        app: {
          name: entityName + ' Manager',
          version: '1.0.0',
          description: `Auto-generated from ${csvData.fileName}`
        },
        entities: [
          {
            name: entityName,
            fields: fields
          }
        ],
        pages: [
          {
            name: 'Dashboard',
            path: '/',
            layout: 'dashboard',
            components: [
              {
                type: 'heading',
                props: { text: entityName + ' Dashboard', level: 1 }
              },
              {
                type: 'columns',
                props: { count: 3 },
                children: [
                  {
                    type: 'card',
                    props: {
                      title: 'Total Records',
                      source: entityName,
                      aggregate: 'count'
                    }
                  },
                  {
                    type: 'card',
                    props: {
                      title: 'Recent Additions',
                      source: entityName,
                      aggregate: 'count',
                      filter: { recent: true }
                    }
                  },
                  {
                    type: 'card',
                    props: {
                      title: 'Fields',
                      source: entityName,
                      aggregate: 'fields'
                    }
                  }
                ]
              },
              {
                type: 'table',
                props: {
                  source: entityName,
                  columns: displayCols,
                  actions: ['edit', 'delete']
                }
              }
            ]
          },
          {
            name: 'Add ' + entityName,
            path: '/new',
            layout: 'form',
            components: [
              {
                type: 'heading',
                props: { text: 'Add ' + entityName, level: 1 }
              },
              {
                type: 'form',
                props: {
                  source: entityName,
                  submitText: 'Create ' + entityName,
                  fields: displayCols
                }
              }
            ]
          }
        ],
        workflows: [
          {
            name: entityName + ' Created',
            trigger: entityName + '.onCreate',
            actions: ['sendNotification', 'logActivity']
          },
          {
            name: entityName + ' Updated',
            trigger: entityName + '.onUpdate',
            actions: ['logActivity']
          }
        ]
      };

      setConfigText(JSON.stringify(newConfig, null, 2));
      setActiveTab('editor');
      addNotification(
        'success',
        t('notifCSVImported') + `: ${csvData.rows.length} rows from ${csvData.fileName}`
      );
      showToast('success', `Generated ${entityName} app with ${fields.length} fields`);
      setStatusText('Ready');
      closeModal();
    }, 1200);
  };

  return (
    <div
      className="modal-overlay"
      onClick={e => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div
        className="modal-content glass"
        style={{
          width: '560px',
          maxWidth: '90vw',
          borderRadius: '16px',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(0,232,157,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px'
            }}
          >
            <i className="fas fa-file-csv" style={{ color: 'var(--accent)', fontSize: '16px' }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '16px' }}>
              {t('csvTitle')}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {t('csvDesc')}
            </div>
          </div>
        </div>

        <div style={{ padding: '24px' }}>
          <div
            className={`drop-zone ${isDragging ? 'drag-over' : ''}`}
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              cursor: 'pointer'
            }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <i
              className="fas fa-cloud-upload-alt"
              style={{
                fontSize: '36px',
                color: 'var(--text-muted)',
                marginBottom: '12px',
                display: 'block'
              }}
            />
            <div
              style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                marginBottom: '4px'
              }}
            >
              {t('csvDrop')}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {t('csvSupported')}
            </div>
          </div>

          {csvData && (
            <div style={{ marginTop: '16px' }}>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: '8px'
                }}
              >
                {t('csvPreview')}
              </div>
              <div
                style={{
                  maxHeight: '200px',
                  overflow: 'auto',
                  border: '1px solid var(--border)',
                  borderRadius: '8px'
                }}
              >
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '12px'
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: 'var(--bg-tertiary)',
                        position: 'sticky',
                        top: 0
                      }}
                    >
                      {csvData.headers.map((h, idx) => (
                        <th
                          key={idx}
                          style={{
                            padding: '8px 12px',
                            textAlign: 'left',
                            fontWeight: 600,
                            color: 'var(--text-secondary)',
                            borderBottom: '1px solid var(--border)',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.rows.slice(0, 10).map((row, rIdx) => (
                      <tr key={rIdx}>
                        {csvData.headers.map((_, cIdx) => (
                          <td
                            key={cIdx}
                            style={{
                              padding: '6px 12px',
                              borderBottom: '1px solid rgba(42,42,58,0.5)',
                              color: 'var(--text-primary)',
                              whiteSpace: 'nowrap',
                              maxWidth: '200px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {row[cIdx] || ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {csvData.rows.length > 10 && (
                      <tr>
                        <td
                          colSpan={csvData.headers.length}
                          style={{
                            padding: '8px 12px',
                            textAlign: 'center',
                            color: 'var(--text-muted)',
                            fontStyle: 'italic'
                          }}
                        >
                          ... and {csvData.rows.length - 10} more rows
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px'
          }}
        >
          <button
            onClick={closeModal}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'none',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            {t('csvCancel')}
          </button>
          <button
            onClick={generateConfig}
            disabled={!csvData || isGenerating}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--accent)',
              color: 'var(--bg-primary)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: (!csvData || isGenerating) ? 'default' : 'pointer',
              opacity: (!csvData || isGenerating) ? 0.5 : 1
            }}
          >
            {isGenerating ? (
              <>
                <i className="fas fa-spinner fa-spin" style={{ marginRight: '6px' }} />
                {t('csvGenerating')}
              </>
            ) : (
              t('csvGenerate')
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
