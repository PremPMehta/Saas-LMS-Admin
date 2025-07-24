import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import { ThemeProvider } from './contexts/ThemeContext';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';

const drawerWidth = 240;

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Box sx={{ display: 'flex' }}>
          <Sidebar />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              width: `calc(100% - ${drawerWidth}px)`,
              minHeight: '100vh',
              backgroundColor: 'background.default',
            }}
          >
            <Navbar />
            <Box
              sx={{
                pt: 8, // Account for the fixed navbar
                minHeight: 'calc(100vh - 64px)',
              }}
            >
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/academies" element={<div style={{ padding: '24px' }}>Academies Page - Coming Soon</div>} />
                <Route path="/plans" element={<div style={{ padding: '24px' }}>Plans Page - Coming Soon</div>} />
                <Route path="/users" element={<div style={{ padding: '24px' }}>Users Page - Coming Soon</div>} />
                <Route path="/analytics" element={<div style={{ padding: '24px' }}>Analytics Page - Coming Soon</div>} />
                <Route path="/settings" element={<div style={{ padding: '24px' }}>Settings Page - Coming Soon</div>} />
                <Route path="/profile" element={<div style={{ padding: '24px' }}>Profile Page - Coming Soon</div>} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
