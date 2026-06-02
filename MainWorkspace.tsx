import React from 'react';
import { useApp, TabType } from '../context/AppContext';
import { EditorTab } from './tabs/EditorTab';
import { PreviewTab } from './tabs/PreviewTab';
import { APITab } from './tabs/APITab';
import { DatabaseTab } from './tabs/DatabaseTab';
import { WorkflowsTab } from './tabs/WorkflowsTab';

export const MainWorkspace: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    t,
    statusText,
    config,
    validationIssues
  } = useApp();

  const tabs: Array<{ id: TabType; labelKey: string; icon: string }> = [
    { id: 'editor', labelKey: 'jsonConfig', icon: 'fa-code' },
    { id: 'preview', labelKey: 'preview', icon: 'fa-eye' },
    { id: 'api', labelKey: 'apiEndpoints', icon: 'fa-plug' },
    { id: 'database', labelKey: 'databaseSchema', icon: 'fa-database' },
    { id: 'workflows', labelKey: 'workflows', icon: 'fa-sitemap' }
  ];

  const entityCount = config?.entities?.length || 0;
  const apiCount = entityCount * 5;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* Editor Tabs Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-secondary)',
          padding: '0 12px',
          gap: 0,
          overflowX: 'auto',
          flexShrink: 0
        }}
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <i className={`fas ${tab.icon}`} style={{ marginRight: '6px', fontSize: '11px' }} />
            <span>{t(tab.labelKey)}</span>
          </button>
        ))}

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 0' }}>
          <div className="status-dot" style={{ background: 'var(--accent)' }} />
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {statusText}
          </span>
        </div>
      </div>

      {/* Tab Content Body */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {activeTab === 'editor' && <EditorTab />}
        {activeTab === 'preview' && <PreviewTab />}
        {activeTab === 'api' && <APITab />}
        {activeTab === 'database' && <DatabaseTab />}
        {activeTab === 'workflows' && <WorkflowsTab />}
      </div>

      {/* Bottom Status Bar */}
      <div
        style={{
          height: '32px',
          borderTop: '1px solid var(--border)',
          background: 'var(--bg-secondary)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          gap: '16px',
          flexShrink: 0
        }}
      >
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          <i className="fas fa-circle" style={{ fontSize: '6px', color: 'var(--accent)', marginRight: '4px' }} />
          <span>{t('connected')}</span>
        </span>

        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          Entities: {entityCount}
        </span>

        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          APIs: {apiCount}
        </span>

        <span style={{ fontSize: '11px' }}>
          {!config ? (
            <span style={{ color: 'var(--danger)' }}>
              <i className="fas fa-times-circle" style={{ marginRight: '3px' }} />
              {t('invalidJson')}
            </span>
          ) : validationIssues.length > 0 ? (
            <span style={{ color: 'var(--warning)' }}>
              <i className="fas fa-exclamation-triangle" style={{ marginRight: '3px' }} />
              {validationIssues.length} {t('validationError').toLowerCase()}(s)
            </span>
          ) : (
            <span style={{ color: 'var(--accent)' }}>
              <i className="fas fa-check-circle" style={{ marginRight: '3px' }} />
              Valid
            </span>
          )}
        </span>

        <div style={{ flex: 1 }} />

        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          MetaForge Runtime v1.0
        </span>
      </div>

    </div>
  );
};
