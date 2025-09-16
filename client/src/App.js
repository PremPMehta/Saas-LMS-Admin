import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { SidebarProvider } from './contexts/SidebarContext';

function App() {
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
