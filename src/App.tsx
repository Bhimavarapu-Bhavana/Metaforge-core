import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastContainer } from './components/ToastContainer';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MainWorkspace } from './components/MainWorkspace';
import { CSVModal } from './components/CSVModal';
import { AuthModal } from './components/AuthModal';
import { DeployModal } from './components/DeployModal';

const AppContent: React.FC = () => {
  const {
    setActiveTab,
    setIsCsvModalOpen,
    setIsAuthModalOpen,
    setIsDeployModalOpen,
    showToast
  } = useApp();

  // Keyboard shortcuts matching original specification
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        showToast('success', 'Configuration validated');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        setActiveTab('preview');
      }
      if (e.key === 'Escape') {
        setIsCsvModalOpen(false);
        setIsAuthModalOpen(false);
        setIsDeployModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setActiveTab, setIsCsvModalOpen, setIsAuthModalOpen, setIsDeployModalOpen, showToast]);

  return (
    <>
      <ToastContainer />
      <Header />
      
      {/* Main Layout Shell */}
      <div style={{ display: 'flex', height: 'calc(100vh - 57px)' }}>
        <Sidebar />
        <MainWorkspace />
      </div>

      {/* Modals */}
      <CSVModal />
      <AuthModal />
      <DeployModal />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
