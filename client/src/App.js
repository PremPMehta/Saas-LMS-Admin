import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Discovery from './pages/Discovery';

// Create a clean theme for the client app
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4285f4',
    },
    secondary: {
      main: '#34a853',
    },
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h2: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Discovery />} />
            <Route path="/discovery" element={<Discovery />} />
            {/* Add more client routes here */}
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
