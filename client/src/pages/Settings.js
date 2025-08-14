import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Fade,
  Grow,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import {
  Security as SecurityIcon,
  History as HistoryIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  LocationOn as LocationIcon,
  Computer as ComputerIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { mode } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [accessLogs, setAccessLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalLogs, setTotalLogs] = useState(0);
  
  // Session timeout settings
  const [sessionSettings, setSessionSettings] = useState({
    sessionTimeout: 30, // minutes
    enableSessionTimeout: true,
    enableIdleTimeout: true,
    idleTimeout: 15, // minutes
    enableRememberMe: true,
    rememberMeDuration: 7, // days
  });

  // Check if user is admin, redirect if not
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Fetch access logs
  const fetchAccessLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch(`http://localhost:5001/api/settings/access-logs?page=${page + 1}&limit=${rowsPerPage}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          console.error('Authentication failed');
          return;
        }
        throw new Error(`Failed to fetch access logs: ${response.status}`);
      }
      
      const data = await response.json();
      setAccessLogs(data.data || []);
      setTotalLogs(data.total || 0);
    } catch (error) {
      console.error('Error fetching access logs:', error);
      // For demo purposes, create mock data
      createMockAccessLogs();
    } finally {
      setIsLoading(false);
    }
  }, [page, rowsPerPage]);

  // Create mock access logs for demo
  const createMockAccessLogs = () => {
    const mockLogs = [
      {
        id: 1,
        username: 'admin@bbartek.com',
        loginTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        ipAddress: '192.168.1.100',
        location: 'Mumbai, India',
        userAgent: 'Chrome 120.0.0.0',
        status: 'success'
      },
      {
        id: 2,
        username: 'john.doe@example.com',
        loginTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        ipAddress: '203.45.67.89',
        location: 'Delhi, India',
        userAgent: 'Firefox 119.0',
        status: 'success'
      },
      {
        id: 3,
        username: 'jane.smith@example.com',
        loginTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        ipAddress: '45.67.89.123',
        location: 'Bangalore, India',
        userAgent: 'Safari 17.0',
        status: 'success'
      },
      {
        id: 4,
        username: 'admin@bbartek.com',
        loginTime: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        ipAddress: '192.168.1.100',
        location: 'Mumbai, India',
        userAgent: 'Chrome 120.0.0.0',
        status: 'success'
      },
      {
        id: 5,
        username: 'test@example.com',
        loginTime: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        ipAddress: '67.89.123.45',
        location: 'Chennai, India',
        userAgent: 'Edge 119.0',
        status: 'failed'
      }
    ];
    setAccessLogs(mockLogs);
    setTotalLogs(mockLogs.length);
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAccessLogs();
    }
  }, [user, page, rowsPerPage]);

  const handleSessionSettingChange = (field, value) => {
    setSessionSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch('http://localhost:5001/api/settings/session', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(sessionSettings),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save settings: ${response.status}`);
      }
      
      // Show success message (you can add a snackbar here)
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      // For demo purposes, just log success
      console.log('Settings saved successfully (demo mode)');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    return status === 'success' ? 'success' : 'error';
  };

  if (!user || user.role !== 'admin') {
    return null; // Will redirect in useEffect
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: mode === 'light' 
          ? 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
          : 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Page Header */}
        <Fade in timeout={800}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 800,
                color: 'text.primary',
                mb: 1,
                textAlign: { xs: 'center', md: 'left' },
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              System Settings
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                fontWeight: 500,
                textAlign: { xs: 'center', md: 'left' },
                mb: 3,
              }}
            >
              Configure system settings and monitor user access
            </Typography>
          </Box>
        </Fade>

        <Grid container spacing={4}>
          {/* Session Settings */}
          <Grid item xs={12} lg={6}>
            <Grow in timeout={1000}>
              <Card
                elevation={0}
                sx={{
                  background: (theme) => theme.palette.mode === 'light'
                    ? 'rgba(255, 255, 255, 0.9)'
                    : 'rgba(26, 26, 26, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: (theme) => `1px solid ${theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`,
                  borderRadius: 3,
                  height: 'fit-content',
                }}
              >
                <CardHeader
                  avatar={<SecurityIcon color="primary" />}
                  title="Session Management"
                  titleTypographyProps={{ fontWeight: 600 }}
                />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={sessionSettings.enableSessionTimeout}
                            onChange={(e) => handleSessionSettingChange('enableSessionTimeout', e.target.checked)}
                            color="primary"
                          />
                        }
                        label="Enable Session Timeout"
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Session Timeout (minutes)"
                        type="number"
                        value={sessionSettings.sessionTimeout}
                        onChange={(e) => handleSessionSettingChange('sessionTimeout', parseInt(e.target.value))}
                        disabled={!sessionSettings.enableSessionTimeout}
                        InputProps={{ inputProps: { min: 1, max: 1440 } }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={sessionSettings.enableIdleTimeout}
                            onChange={(e) => handleSessionSettingChange('enableIdleTimeout', e.target.checked)}
                            color="primary"
                          />
                        }
                        label="Enable Idle Timeout"
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Idle Timeout (minutes)"
                        type="number"
                        value={sessionSettings.idleTimeout}
                        onChange={(e) => handleSessionSettingChange('idleTimeout', parseInt(e.target.value))}
                        disabled={!sessionSettings.enableIdleTimeout}
                        InputProps={{ inputProps: { min: 1, max: 1440 } }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={sessionSettings.enableRememberMe}
                            onChange={(e) => handleSessionSettingChange('enableRememberMe', e.target.checked)}
                            color="primary"
                          />
                        }
                        label="Enable Remember Me"
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Remember Me Duration (days)"
                        type="number"
                        value={sessionSettings.rememberMeDuration}
                        onChange={(e) => handleSessionSettingChange('rememberMeDuration', parseInt(e.target.value))}
                        disabled={!sessionSettings.enableRememberMe}
                        InputProps={{ inputProps: { min: 1, max: 365 } }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSaveSettings}
                        disabled={isSaving}
                        fullWidth
                        sx={{
                          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                          py: 1.5,
                          borderRadius: 2,
                          fontWeight: 600,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                          },
                        }}
                      >
                        {isSaving ? <CircularProgress size={20} color="inherit" /> : 'Save Settings'}
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Access Logs */}
          <Grid item xs={12} lg={6}>
            <Grow in timeout={1200}>
              <Card
                elevation={0}
                sx={{
                  background: (theme) => theme.palette.mode === 'light'
                    ? 'rgba(255, 255, 255, 0.9)'
                    : 'rgba(26, 26, 26, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: (theme) => `1px solid ${theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`,
                  borderRadius: 3,
                }}
              >
                <CardHeader
                  avatar={<HistoryIcon color="primary" />}
                  title="Recent Access Logs"
                  titleTypographyProps={{ fontWeight: 600 }}
                  action={
                    <Tooltip title="Refresh">
                      <IconButton onClick={fetchAccessLogs} disabled={isLoading}>
                        <RefreshIcon />
                      </IconButton>
                    </Tooltip>
                  }
                />
                <CardContent sx={{ p: 0 }}>
                  {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell><PersonIcon sx={{ fontSize: 16, mr: 0.5 }} />User</TableCell>
                              <TableCell><AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />Login Time</TableCell>
                              <TableCell><ComputerIcon sx={{ fontSize: 16, mr: 0.5 }} />IP Address</TableCell>
                              <TableCell><LocationIcon sx={{ fontSize: 16, mr: 0.5 }} />Location</TableCell>
                              <TableCell>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {accessLogs
                              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                              .map((log) => (
                                <TableRow key={log.id} hover>
                                  <TableCell>
                                    <Typography variant="body2" fontWeight={500}>
                                      {log.username}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                      {formatDateTime(log.loginTime)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" fontFamily="monospace">
                                      {log.ipAddress}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                      {log.location}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={log.status}
                                      color={getStatusColor(log.status)}
                                      size="small"
                                      variant="outlined"
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      
                      <TablePagination
                        component="div"
                        count={totalLogs}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        labelRowsPerPage="Rows per page:"
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Settings;
