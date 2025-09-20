import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { SidebarProvider } from './contexts/SidebarContext';
import keepAliveService from './utils/keepAliveService';

function App() {
  useEffect(() => {
    // Start keep-alive service to prevent server cold starts
    keepAliveService.start();
    
    // Cleanup on unmount
    return () => {
      keepAliveService.stop();
    };
  }, []);

  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <SidebarProvider>
            <div className="App">
              <AppRoutes />
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
