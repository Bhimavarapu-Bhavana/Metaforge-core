import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export type ViewportSize = 'desktop' | 'tablet' | 'mobile';

export const PreviewTab: React.FC = () => {
  const { config } = useApp();
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [viewport, setViewport] = useState<ViewportSize>('desktop');

  if (!config) {
    return (
      <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-tertiary)', padding: '20px', overflow: 'auto' }}>
        <div className="preview-frame" style={{ maxWidth: '960px', margin: '0 auto', minHeight: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ padding: '40px', textAlign: 'center', color: '#666', fontFamily: 'sans-serif' }}>
            <i className="fas fa-exclamation-circle" style={{ fontSize: '32px', marginBottom: '12px', display: 'block' }} />
            Invalid JSON configuration
          </div>
        </div>
      </div>
    );
  }

  const pages = config.pages || [];
  const activePage = pages[activePageIndex] || pages[0];

  const viewportWidths: Record<ViewportSize, string> = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px'
  };

  const frameMaxWidth = viewport === 'desktop' ? '960px' : viewportWidths[viewport];

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-tertiary)', padding: '20px', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      
      {/* Responsive Viewport Options Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px', flexShrink: 0 }}>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
          Viewport:
        </span>
        <button
          onClick={() => setViewport('desktop')}
          style={{
            padding: '4px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            background: viewport === 'desktop' ? 'var(--accent)' : 'var(--bg-card)',
            color: viewport === 'desktop' ? 'var(--bg-primary)' : 'var(--text-primary)',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            transition: 'all 0.15s'
          }}
          title="Desktop view"
        >
          <i className="fas fa-desktop" style={{ marginRight: '6px' }} /> Desktop
        </button>
        <button
          onClick={() => setViewport('tablet')}
          style={{
            padding: '4px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            background: viewport === 'tablet' ? 'var(--accent)' : 'var(--bg-card)',
            color: viewport === 'tablet' ? 'var(--bg-primary)' : 'var(--text-primary)',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            transition: 'all 0.15s'
          }}
          title="Tablet view"
        >
          <i className="fas fa-tablet-alt" style={{ marginRight: '6px' }} /> Tablet
        </button>
        <button
          onClick={() => setViewport('mobile')}
          style={{
            padding: '4px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            background: viewport === 'mobile' ? 'var(--accent)' : 'var(--bg-card)',
            color: viewport === 'mobile' ? 'var(--bg-primary)' : 'var(--text-primary)',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            transition: 'all 0.15s'
          }}
          title="Mobile view"
        >
          <i className="fas fa-mobile-alt" style={{ marginRight: '6px' }} /> Mobile
        </button>
      </div>

      {/* Main Responsive Preview Frame */}
      <div 
        className="preview-frame" 
        style={{ 
          width: viewportWidths[viewport],
          maxWidth: frameMaxWidth, 
          margin: '0 auto', 
          minHeight: '500px', 
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)', 
          display: 'flex', 
          flexDirection: 'column',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          flexShrink: 0
        }}
      >
        
        {/* Main Content Area */}
        <div style={{ flex: 1 }}>
          {activePage ? (
            <div className="page-content" style={{ padding: viewport === 'mobile' ? '16px' : '24px' }}>
              {activePage.components && activePage.components.map((comp, idx) => (
                <PreviewComponent key={idx} comp={comp} viewport={viewport} />
              ))}
            </div>
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              <i className="fas fa-file-alt" style={{ fontSize: '32px', marginBottom: '12px', display: 'block' }} />
              No pages defined in configuration
            </div>
          )}
        </div>

        {/* Page Switcher Bar */}
        {pages.length > 1 && (
          <div
            style={{
              borderTop: '1px solid #eee',
              padding: '12px 20px',
              display: 'flex',
              gap: '8px',
              background: '#fafafa',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}
          >
            <span
              style={{
                fontSize: '11px',
                color: '#888',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                lineHeight: '28px',
                marginRight: '8px'
              }}
            >
              Pages:
            </span>
            {pages.map((p, i) => {
              const isActive = i === activePageIndex;
              return (
                <button
                  key={i}
                  onClick={() => setActivePageIndex(i)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '6px',
                    border: `1px solid ${isActive ? '#00c080' : '#ddd'}`,
                    background: isActive ? '#e8faf4' : 'white',
                    color: isActive ? '#00a070' : '#666',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

// Deterministic hash code matching reference implementation
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

// Highly Intelligent Pattern Matcher for Real-World Sample Data
function getRealisticValue(colName: string, index: number): string {
  const lower = colName.toLowerCase();
  
  // Real full names / patient names / doctors
  if (lower.includes('name')) {
    const names = [
      'Alice Johnson', 'Dr. Robert Smith', 'Carol White', 
      'David Brown', 'Dr. Evelyn Davis', 'Frank Miller', 
      'Grace Hopper', 'Henry Ford', 'Ivy Chen', 'Jack Wilson'
    ];
    return names[index % names.length];
  }
  
  // Real genders
  if (lower.includes('gender')) {
    const genders = ['Male', 'Female', 'Other', 'Female', 'Male'];
    return genders[index % genders.length];
  }
  
  // Real phone numbers
  if (lower.includes('phone') || lower.includes('mobile') || lower.includes('tel')) {
    const phones = [
      '+1 (555) 123-4567', '+1 (555) 987-6543', 
      '+1 (555) 555-0199', '+1 (555) 333-2211', 
      '+1 (555) 444-8899'
    ];
    return phones[index % phones.length];
  }
  
  // Real emails
  if (lower.includes('email')) {
    const emails = [
      'alice@example.com', 'robert@hospital.org', 
      'carol@example.com', 'david@example.com', 
      'evelyn@hospital.org'
    ];
    return emails[index % emails.length];
  }
  
  // Real dates and times
  if (lower.includes('date') || lower.includes('time')) {
    const dates = [
      '2026-03-15 09:30 AM', '2026-03-16 11:00 AM', 
      '2026-03-18 02:15 PM', '2026-03-20 04:00 PM', 
      '2026-03-22 10:45 AM'
    ];
    return dates[index % dates.length];
  }

  // Real status
  if (lower.includes('status')) {
    const statuses = ['Scheduled', 'Completed', 'Active', 'Pending', 'Cancelled'];
    return statuses[index % statuses.length];
  }

  // Real priority
  if (lower.includes('priority')) {
    const priorities = ['High', 'Medium', 'Low', 'Critical', 'Medium'];
    return priorities[index % priorities.length];
  }

  // Real roles
  if (lower.includes('role')) {
    const roles = ['Doctor', 'Nurse', 'Admin', 'Patient', 'Staff'];
    return roles[index % roles.length];
  }

  // Real titles
  if (lower.includes('title')) {
    const titles = [
      'General Checkup', 'Dental Surgery', 'Blood Test', 
      'Follow-up Consultation', 'X-Ray Scan'
    ];
    return titles[index % titles.length];
  }

  // Real addresses
  if (lower.includes('address') || lower.includes('city')) {
    const addresses = [
      '123 Health Ave, NY', '456 Wellness Blvd, CA', 
      '789 Medical Pkwy, TX', '101 Care St, FL', 
      '202 Recovery Rd, WA'
    ];
    return addresses[index % addresses.length];
  }

  // Generic fallback if not matched
  return `${colName}_${index + 1}`;
}

function generateSampleData(cols: string[], count: number): Record<string, any>[] {
  const rows: Record<string, any>[] = [];
  for (let i = 0; i < count; i++) {
    const row: Record<string, any> = {};
    cols.forEach(col => {
      row[col] = getRealisticValue(col, i);
    });
    rows.push(row);
  }
  return rows;
}

// Stateful Sub-component specifically for previewing Tables interactively
const TablePreview: React.FC<{ props: any; viewport: ViewportSize }> = ({ props, viewport }) => {
  const cols = props.columns || [];
  
  // Stateful internal list initialized with smart realistic data
  const [rows, setRows] = useState<Record<string, any>[]>(() => generateSampleData(cols, 5));
  
  // Interactive editing / adding controls
  const [isAdding, setIsAdding] = useState(false);
  const [newRowData, setNewRowData] = useState<Record<string, string>>({});
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleInputChange = (col: string, val: string) => {
    setNewRowData(prev => ({ ...prev, [col]: val }));
  };

  const handleSaveNewRow = () => {
    // Fill any missing columns with blanks
    const completeRow: Record<string, any> = {};
    cols.forEach((c: string) => {
      completeRow[c] = newRowData[c] || '';
    });

    if (editingIndex !== null) {
      // Update existing row
      setRows(prev => prev.map((r, i) => i === editingIndex ? completeRow : r));
      setEditingIndex(null);
    } else {
      // Append new row
      setRows(prev => [completeRow, ...prev]);
    }

    setNewRowData({});
    setIsAdding(false);
  };

  const handleStartEdit = (idx: number) => {
    setEditingIndex(idx);
    setNewRowData(rows[idx]);
    setIsAdding(true);
  };

  const handleDeleteRow = (idx: number) => {
    setRows(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div
      style={{
        background: 'white',
        border: '1px solid #eee',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}
    >
      <div
        style={{
          padding: viewport === 'mobile' ? '12px 14px' : '16px 20px',
          borderBottom: '1px solid #eee',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <span style={{ fontWeight: 600, fontSize: viewport === 'mobile' ? '14px' : '15px', color: '#1a1a2e' }}>
          {props.source || 'Table'}
        </span>
        
        {!isAdding && (
          <button
            onClick={() => {
              setEditingIndex(null);
              setNewRowData({});
              setIsAdding(true);
            }}
            style={{
              padding: '6px 14px',
              background: '#00c080',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.15s'
            }}
          >
            + Add New
          </button>
        )}
      </div>

      {/* Inline row addition/editing interface */}
      {isAdding && (
        <div style={{ padding: '16px', background: '#fcfcfc', borderBottom: '1px solid #eee' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#333', marginBottom: '12px' }}>
            {editingIndex !== null ? 'Edit Row Values' : 'Add New Row Values'}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: viewport === 'mobile' ? '1fr' : 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '12px' }}>
            {cols.map((c: string, idx: number) => (
              <div key={idx}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#666', marginBottom: '4px', textTransform: 'capitalize' }}>
                  {c}
                </label>
                <input
                  type="text"
                  placeholder={`Enter ${c}`}
                  value={newRowData[c] || ''}
                  onChange={e => handleInputChange(c, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = '#00c080'}
                  onBlur={e => e.currentTarget.style.borderColor = '#ddd'}
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => {
                setIsAdding(false);
                setEditingIndex(null);
                setNewRowData({});
              }}
              style={{
                padding: '6px 12px',
                background: '#eee',
                color: '#555',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNewRow}
              style={{
                padding: '6px 16px',
                background: '#00c080',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Save Values
            </button>
          </div>
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              {cols.map((c: string, cIdx: number) => (
                <th
                  key={cIdx}
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#555',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  {c}
                </th>
              ))}
              <th
                style={{
                  padding: '10px 16px',
                  textAlign: 'right',
                  fontWeight: 600,
                  color: '#555',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={cols.length + 1} style={{ padding: '24px', textAlign: 'center', color: '#999', fontSize: '13px' }}>
                  No data values added yet. Click "+ Add New" to start!
                </td>
              </tr>
            ) : (
              rows.map((row, rIdx) => (
                <tr key={rIdx} style={{ borderTop: '1px solid #f0f0f0' }}>
                  {cols.map((c: string, cIdx: number) => (
                    <td key={cIdx} style={{ padding: '10px 16px', color: '#333', whiteSpace: viewport === 'mobile' ? 'nowrap' : 'normal' }}>
                      {row[c] || '-'}
                    </td>
                  ))}
                  <td style={{ padding: '10px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button
                      onClick={() => handleStartEdit(rIdx)}
                      style={{
                        padding: '4px 8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        background: 'white',
                        color: '#666',
                        fontSize: '11px',
                        cursor: 'pointer',
                        marginRight: '4px'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteRow(rIdx)}
                      style={{
                        padding: '4px 8px',
                        border: '1px solid #ffcccc',
                        borderRadius: '4px',
                        background: 'white',
                        color: '#ff4444',
                        fontSize: '11px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Sub-component renderer
const PreviewComponent: React.FC<{ comp: any; viewport: ViewportSize }> = ({ comp, viewport }) => {
  const p = comp.props || {};

  switch (comp.type) {
    case 'heading': {
      const level = p.level || 1;
      const sizes: Record<number, string> = { 1: '28px', 2: '22px', 3: '18px' };
      
      // Slightly scale down on mobile viewports
      const defaultSize = sizes[level] || '28px';
      const fontSize = viewport === 'mobile' 
        ? level === 1 ? '22px' : level === 2 ? '18px' : '16px' 
        : defaultSize;

      const style = { fontSize, fontWeight: 700, color: '#1a1a2e', margin: 0 };
      const text = p.text || 'Heading';

      return (
        <div style={{ marginBottom: '16px' }}>
          {level === 1 && <h1 style={style}>{text}</h1>}
          {level === 2 && <h2 style={style}>{text}</h2>}
          {level >= 3 && <h3 style={style}>{text}</h3>}
        </div>
      );
    }

    case 'text':
      return (
        <p style={{ color: '#555', fontSize: '14px', lineHeight: 1.6, marginBottom: '12px' }}>
          {p.text || 'Text content'}
        </p>
      );

    case 'card': {
      const colors = ['#00c080', '#ff6b4a', '#6b8aff', '#ffaa22', '#c084fc'];
      const c = colors[Math.abs(hashCode(p.title || '')) % colors.length];

      // Generate a stable pseudo-random integer
      const randVal = Math.abs(hashCode((p.title || '') + (p.source || ''))) % 41 + 10;

      return (
        <div
          style={{
            background: 'white',
            border: '1px solid #eee',
            borderRadius: '12px',
            padding: viewport === 'mobile' ? '14px' : '20px',
            marginBottom: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: '#888',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px'
            }}
          >
            {p.title || 'Card'}
          </div>
          <div style={{ fontSize: viewport === 'mobile' ? '26px' : '32px', fontWeight: 700, color: c }}>
            {randVal}
          </div>
          <div style={{ fontSize: '11px', color: '#aaa', marginTop: '4px' }}>
            {p.source || ''} {p.aggregate || ''}
          </div>
        </div>
      );
    }

    case 'columns': {
      const count = p.count || 2;
      
      // Intelligent Responsive Scaling: Collapse into single column on mobile!
      const gridTemplateColumns = viewport === 'mobile' ? '1fr' : `repeat(${count}, 1fr)`;

      return (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns,
            gap: '12px',
            marginBottom: '16px'
          }}
        >
          {comp.children && comp.children.map((child: any, idx: number) => (
            <PreviewComponent key={idx} comp={child} viewport={viewport} />
          ))}
        </div>
      );
    }

    case 'table':
      return <TablePreview props={p} viewport={viewport} />;

    case 'form': {
      const fields = p.fields || [];

      return (
        <div
          style={{
            background: 'white',
            border: '1px solid #eee',
            borderRadius: '12px',
            padding: viewport === 'mobile' ? '16px' : '24px',
            maxWidth: '600px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <form onSubmit={e => e.preventDefault()}>
            {fields.map((f: string, fIdx: number) => (
              <div key={fIdx} style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#333',
                    marginBottom: '6px'
                  }}
                >
                  {f}
                </label>
                <input
                  type="text"
                  placeholder={`Enter ${f}`}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.15s'
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#00c080')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#ddd')}
                />
              </div>
            ))}
            <button
              type="submit"
              onClick={() => alert('Form submitted successfully')}
              style={{
                padding: '10px 24px',
                background: '#00c080',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                width: viewport === 'mobile' ? '100%' : 'auto'
              }}
            >
              {p.submitText || 'Submit'}
            </button>
          </form>
        </div>
      );
    }

    case 'chart': {
      const statuses = ['Scheduled', 'Completed', 'Cancelled'];
      const values = [18, 42, 5];
      const maxVal = Math.max(...values);
      const colors = ['#6b8aff', '#00c080', '#ff4466'];

      return (
        <div
          style={{
            background: 'white',
            border: '1px solid #eee',
            borderRadius: '12px',
            padding: viewport === 'mobile' ? '14px' : '20px',
            marginBottom: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <div style={{ fontWeight: 600, fontSize: '15px', color: '#1a1a2e', marginBottom: '16px' }}>
            {p.title || 'Appointments By Status'}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', height: '180px', paddingTop: '20px' }}>
            {statuses.map((s, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: colors[i] }}>
                  {values[i]}
                </span>
                <div
                  style={{
                    width: '100%',
                    maxWidth: '60px',
                    background: colors[i],
                    borderRadius: '6px 6px 0 0',
                    height: `${(values[i] / maxVal) * 140}px`,
                    transition: 'height 0.5s ease'
                  }}
                />
                <span style={{ fontSize: '11px', color: '#888', fontWeight: 500, textAlign: 'center' }}>
                  {s}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'button':
      return (
        <button
          onClick={() => alert('Button clicked')}
          style={{
            padding: '10px 20px',
            background: p.color || '#00c080',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: '12px',
            width: viewport === 'mobile' ? '100%' : 'auto'
          }}
        >
          {p.text || 'Button'}
        </button>
      );

    case 'image':
      return (
        <img
          src={p.src || 'https://picsum.photos/seed/metaforge/600/300.jpg'}
          alt={p.alt || ''}
          style={{
            width: '100%',
            borderRadius: '12px',
            marginBottom: '12px',
            objectFit: 'cover',
            maxHeight: '300px'
          }}
        />
      );

    default:
      return (
        <div
          style={{
            padding: '12px',
            border: '1px dashed #ddd',
            borderRadius: '8px',
            color: '#999',
            fontSize: '13px',
            marginBottom: '12px'
          }}
        >
          <i className="fas fa-question-circle" style={{ marginRight: '6px' }} />
          Unknown: {comp.type}
        </div>
      );
  }
};
