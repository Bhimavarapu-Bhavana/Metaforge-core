import React from 'react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  const colors = {
    success: { 
      bg: 'rgba(0,232,157,0.1)', 
      border: 'rgba(0,232,157,0.3)', 
      icon: 'fa-check-circle', 
      color: '#00e89d' 
    },
    error: { 
      bg: 'rgba(255,68,102,0.1)', 
      border: 'rgba(255,68,102,0.3)', 
      icon: 'fa-times-circle', 
      color: '#ff4466' 
    },
    warning: { 
      bg: 'rgba(255,170,34,0.1)', 
      border: 'rgba(255,170,34,0.3)', 
      icon: 'fa-exclamation-triangle', 
      color: '#ffaa22' 
    },
    info: { 
      bg: 'rgba(107,138,255,0.1)', 
      border: 'rgba(107,138,255,0.3)', 
      icon: 'fa-info-circle', 
      color: '#6b8aff' 
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(item => {
        const c = colors[item.type] || colors.info;
        return (
          <div
            key={item.id}
            className="toast"
            style={{
              background: c.bg,
              borderColor: c.border
            }}
          >
            <i 
              className={`fas ${c.icon}`} 
              style={{ color: c.color, fontSize: '15px' }} 
            />
            <span style={{ color: 'var(--text-primary)' }}>
              {item.message}
            </span>
          </div>
        );
      })}
    </div>
  );
};
