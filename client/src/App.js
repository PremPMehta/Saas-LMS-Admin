import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import FirstTimeLoginWrapper from './components/FirstTimeLoginWrapper';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <FirstTimeLoginWrapper>
            <AppRoutes />
          </FirstTimeLoginWrapper>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
