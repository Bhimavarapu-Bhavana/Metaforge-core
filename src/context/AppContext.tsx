import React, { createContext, useContext, useState, useMemo } from 'react';
import { Language, getTranslation } from '../utils/i18n';
import { AppConfig, defaultConfig } from '../data/defaultConfig';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

export interface NotificationItem {
  id: string;
  type: ToastType;
  message: string;
  time: Date;
}

export type TabType = 'editor' | 'preview' | 'api' | 'database' | 'workflows';

export interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;

  // Toasts
  toasts: ToastItem[];
  showToast: (type: ToastType, message: string) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (type: ToastType, message: string) => void;
  clearNotifications: () => void;
  resetUnreadCount: () => void;

  // Config State
  configText: string;
  setConfigText: (text: string) => void;
  config: AppConfig | null;
  validationIssues: string[];

  // Modals
  isCsvModalOpen: boolean;
  setIsCsvModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isDeployModalOpen: boolean;
  setIsDeployModalOpen: (open: boolean) => void;

  // Tabs
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;

  // Status text
  statusText: string;
  setStatusText: (text: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('en');
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  
  // Translation utility wrapped with useMemo/Callback
  const t = (key: string) => getTranslation(lang, key);

  // Notifications with initial mock items matching the reference design
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => [
    { 
      id: 'init-1', 
      type: 'success', 
      message: getTranslation('en', 'notifAppGen'), 
      time: new Date(Date.now() - 120000) 
    },
    { 
      id: 'init-2', 
      type: 'info', 
      message: getTranslation('en', 'notifSchemaCreated'), 
      time: new Date(Date.now() - 60000) 
    },
    { 
      id: 'init-3', 
      type: 'info', 
      message: getTranslation('en', 'notifApisReady'), 
      time: new Date(Date.now() - 30000) 
    }
  ]);
  const [unreadCount, setUnreadCount] = useState<number>(3);

  // Config state
  const [configText, setConfigText] = useState<string>(() => JSON.stringify(defaultConfig, null, 2));

  // Tabs & Modals
  const [activeTab, setActiveTab] = useState<TabType>('editor');
  const [isCsvModalOpen, setIsCsvModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>('Ready');

  // Parse Config
  const config = useMemo(() => {
    try {
      return JSON.parse(configText) as AppConfig;
    } catch {
      return null;
    }
  }, [configText]);

  // Validate Config
  const validationIssues = useMemo(() => {
    if (!config) return [];
    const issues: string[] = [];

    if (!config.app || !config.app.name) {
      issues.push(t('missingFields') + ': app.name');
    }

    if (!config.entities || !Array.isArray(config.entities)) {
      issues.push(t('missingFields') + ': entities array');
    } else {
      config.entities.forEach((entity, idx) => {
        if (!entity.name) issues.push(`Entity ${idx}: ${t('missingFields')} name`);
        if (!entity.fields || !Array.isArray(entity.fields)) {
          issues.push(`Entity ${entity.name || idx}: missing fields`);
        } else {
          const hasPrimary = entity.fields.some(f => f.constraints && f.constraints.includes('primary'));
          if (!hasPrimary) issues.push(`Entity ${entity.name}: no primary key`);
          
          entity.fields.forEach(field => {
            if (field.reference && !field.reference.includes('.')) {
              issues.push(`${entity.name}.${field.name}: ${t('inconsistentSchema')} "${field.reference}"`);
            }
          });
        }
      });
    }

    if (config.pages) {
      config.pages.forEach(page => {
        if (page.components) {
          page.components.forEach(comp => {
            const validTypes = [
              'heading', 'text', 'image', 'table', 'list', 'card', 
              'form', 'button', 'input', 'container', 'columns', 
              'navbar', 'tabs', 'chart'
            ];
            if (!validTypes.includes(comp.type)) {
              issues.push(`Page "${page.name}": ${t('unknownComponent')} "${comp.type}"`);
            }
          });
        }
      });
    }

    return issues;
  }, [config, lang]);

  // Show Toast wrapper
  const showToast = (type: ToastType, message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, type, message }]);

    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(tItem => tItem.id !== id));
    }, 4000);
  };

  // Add notification wrapper
  const addNotification = (type: ToastType, message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setNotifications(prev => [{ id, type, message, time: new Date() }, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const resetUnreadCount = () => {
    setUnreadCount(0);
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t,
        toasts,
        showToast,
        notifications,
        unreadCount,
        addNotification,
        clearNotifications,
        resetUnreadCount,
        configText,
        setConfigText,
        config,
        validationIssues,
        isCsvModalOpen,
        setIsCsvModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isDeployModalOpen,
        setIsDeployModalOpen,
        activeTab,
        setActiveTab,
        statusText,
        setStatusText
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
