import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';

interface DeployStep {
  text: string;
  icon: string;
  time: number;
}

export const DeployModal: React.FC = () => {
  const {
    isDeployModalOpen,
    setIsDeployModalOpen,
    config,
    validationIssues,
    t,
    addNotification,
    showToast
  } = useApp();

  const [isDeploying, setIsDeploying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number>(0);
  const [isDone, setIsDone] = useState(false);
  
  // To avoid duplicate timers
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const steps: DeployStep[] = [
    { text: 'Validating configuration...', icon: 'fa-check-circle', time: 600 },
    { text: 'Creating database schema...', icon: 'fa-database', time: 1000 },
    { text: 'Generating API endpoints...', icon: 'fa-plug', time: 800 },
    { text: 'Compiling frontend...', icon: 'fa-code', time: 1200 },
    { text: 'Setting up workflows...', icon: 'fa-sitemap', time: 600 },
    { text: 'Deploying to production...', icon: 'fa-rocket', time: 1500 }
  ];

  const closeModal = () => {
    setIsDeployModalOpen(false);
    setIsDeploying(false);
    setCompletedSteps(0);
    setIsDone(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const startDeploy = () => {
    if (!config) {
      showToast('error', 'Fix JSON errors before deploying');
      return;
    }
    if (validationIssues.length > 0) {
      showToast('warning', 'Fix validation errors before deploying');
      return;
    }

    setIsDeploying(true);
    setCompletedSteps(0);
    setIsDone(false);
  };

  useEffect(() => {
    if (isDeploying && completedSteps < steps.length) {
      const currentStep = steps[completedSteps];
      timeoutRef.current = setTimeout(() => {
        setCompletedSteps(prev => prev + 1);
      }, currentStep.time);
    } else if (isDeploying && completedSteps === steps.length) {
      setIsDone(true);
      setIsDeploying(false);
      addNotification('success', t('notifDeployed'));
      showToast('success', 'App is live!');
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isDeploying, completedSteps]);

  if (!isDeployModalOpen) return null;

  const slug = (config?.app?.name || 'my-app')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-');

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
          width: '480px',
          maxWidth: '90vw',
          borderRadius: '16px',
          overflow: 'hidden'
        }}
      >
        <div style={{ padding: '24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div
              className="animate-pulse-glow"
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, var(--accent), #00a070)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}
            >
              <i className="fas fa-rocket" style={{ fontSize: '24px', color: 'var(--bg-primary)' }} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>
              {t('deployTitle')}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {t('deployDesc')}
            </p>
          </div>

          <div
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '16px',
              marginBottom: '20px'
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px'
              }}
            >
              {t('deployUrl')}
            </div>
            <div
              className="mono"
              style={{
                fontSize: '14px',
                color: 'var(--accent)',
                wordBreak: 'break-all'
              }}
            >
              https://{slug}.metaforge.app
            </div>
          </div>

          {/* Deployment log section */}
          {(isDeploying || isDone || completedSteps > 0) && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {steps.slice(0, completedSteps + (isDeploying ? 1 : 0)).map((step, idx) => {
                  const isCurrent = idx === completedSteps && isDeploying;
                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '13px',
                        color: isCurrent ? 'var(--text-secondary)' : 'var(--text-primary)'
                      }}
                    >
                      {isCurrent ? (
                        <i
                          className="fas fa-spinner fa-spin"
                          style={{
                            color: 'var(--accent)',
                            fontSize: '12px',
                            width: '16px',
                            textAlign: 'center'
                          }}
                        />
                      ) : (
                        <i
                          className="fas fa-check-circle"
                          style={{
                            color: 'var(--accent)',
                            fontSize: '12px',
                            width: '16px',
                            textAlign: 'center'
                          }}
                        />
                      )}
                      <span>{step.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={closeModal}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'none',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              {t('deployClose')}
            </button>
            <button
              onClick={startDeploy}
              disabled={isDeploying || isDone}
              style={{
                flex: 2,
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                background: isDone ? 'var(--accent)' : 'var(--accent)',
                color: 'var(--bg-primary)',
                fontSize: '13px',
                fontWeight: 700,
                cursor: (isDeploying || isDone) ? 'default' : 'pointer',
                opacity: isDeploying ? 0.5 : 1
              }}
            >
              {isDeploying ? (
                <>
                  <i className="fas fa-spinner fa-spin" style={{ marginRight: '6px' }} />
                  {t('deploying')}
                </>
              ) : isDone ? (
                <>
                  <i className="fas fa-check" style={{ marginRight: '6px' }} />
                  {t('deploySuccess')}
                </>
              ) : (
                t('deployBtn')
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
