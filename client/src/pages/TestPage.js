import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const TestPage = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Test Page Working! 🎉
          </Typography>
          <Typography variant="h6">
            Routing is working correctly
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default TestPage;
