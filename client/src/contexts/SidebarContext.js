import React, { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  // Initialize state from localStorage
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarCollapsed');
      return saved !== 'false'; // Default to collapsed (true) if not set
    }
    return true;
  });

  // Mobile sidebar state
  const [mobileOpen, setMobileOpen] = useState(false);

  // Sync with localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarCollapsed', String(collapsed));
    }
  }, [collapsed]);

  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };

  const setSidebarCollapsed = (isCollapsed) => {
    setCollapsed(isCollapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(prev => !prev);
  };

  const setMobileSidebarOpen = (isOpen) => {
    setMobileOpen(isOpen);
  };

  const value = {
    collapsed,
    mobileOpen,
    toggleSidebar,
    setSidebarCollapsed,
    toggleMobileSidebar,
    setMobileSidebarOpen
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};
