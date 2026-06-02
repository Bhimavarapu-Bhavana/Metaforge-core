import React from 'react';
import { useApp } from '../context/AppContext';

interface ComponentItem {
  type: string;
  label: string;
  icon: string;
  color: string;
}

interface Category {
  title: string;
  items: ComponentItem[];
}

export const Sidebar: React.FC = () => {
  const { t } = useApp();

  const categories: Category[] = [
    {
      title: 'Layout',
      items: [
        { type: 'page', label: 'Page', icon: 'fa-file', color: 'var(--accent-tertiary)' },
        { type: 'container', label: 'Container', icon: 'fa-square', color: 'var(--accent-tertiary)' },
        { type: 'columns', label: 'Columns', icon: 'fa-columns', color: 'var(--accent-tertiary)' }
      ]
    },
    {
      title: 'Data',
      items: [
        { type: 'table', label: 'Table', icon: 'fa-table', color: 'var(--accent)' },
        { type: 'list', label: 'List', icon: 'fa-list', color: 'var(--accent)' },
        { type: 'card', label: 'Card', icon: 'fa-id-card', color: 'var(--accent)' }
      ]
    },
    {
      title: 'Input',
      items: [
        { type: 'form', label: 'Form', icon: 'fa-wpforms', color: 'var(--accent-secondary)' },
        { type: 'button', label: 'Button', icon: 'fa-hand-pointer', color: 'var(--accent-secondary)' },
        { type: 'input', label: 'Input Field', icon: 'fa-keyboard', color: 'var(--accent-secondary)' }
      ]
    },
    {
      title: 'Display',
      items: [
        { type: 'heading', label: 'Heading', icon: 'fa-heading', color: 'var(--warning)' },
        { type: 'text', label: 'Text', icon: 'fa-align-left', color: 'var(--warning)' },
        { type: 'image', label: 'Image', icon: 'fa-image', color: 'var(--warning)' },
        { type: 'chart', label: 'Chart', icon: 'fa-chart-bar', color: 'var(--warning)' }
      ]
    },
    {
      title: 'Navigation',
      items: [
        { type: 'navbar', label: 'Navbar', icon: 'fa-bars', color: '#c084fc' },
        { type: 'tabs', label: 'Tabs', icon: 'fa-folder', color: '#c084fc' }
      ]
    }
  ];

  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ type }));
  };

  return (
    <aside
      className="sidebar-left"
      style={{
        width: '220px',
        flexShrink: 0,
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-secondary)',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          padding: '12px 14px',
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          color: 'var(--text-muted)',
          borderBottom: '1px solid var(--border)'
        }}
      >
        <i className="fas fa-puzzle-piece" style={{ marginRight: '6px' }} />
        <span>{t('components')}</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        {categories.map((cat, catIdx) => (
          <div key={catIdx}>
            <div
              style={{
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: 'var(--text-muted)',
                marginTop: catIdx > 0 ? '8px' : '4px'
              }}
            >
              {cat.title}
            </div>

            {cat.items.map((item, itemIdx) => (
              <div
                key={itemIdx}
                className="component-item"
                draggable
                onDragStart={e => handleDragStart(e, item.type)}
                style={{
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  marginBottom: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <i
                  className={`fas ${item.icon}`}
                  style={{
                    color: item.color,
                    fontSize: '12px',
                    width: '16px',
                    textAlign: 'center'
                  }}
                />
                <span style={{ fontSize: '13px' }}>{item.label}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
};
