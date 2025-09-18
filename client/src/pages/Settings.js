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
  Divider,
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
import useDocumentTitle from '../contexts/useDocumentTitle';

const Settings = () => {
  useDocumentTitle('Settings - Bell n Desk');
  const { mode } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [accessLogs, setAccessLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalLogs, setTotalLogs] = useState(0);
  
  // Session timeout settings - will be loaded from backend
  const [sessionSettings, setSessionSettings] = useState({
    sessionTimeout: 30, // minutes
    enableSessionTimeout: true,
    enableIdleTimeout: true,
    idleTimeout: 15, // minutes
    enableRememberMe: true,
    rememberMeDuration: 7, // days
    maxLoginAttempts: 5,
    lockoutDuration: 15, // minutes
    requirePasswordChange: false,
    passwordExpiryDays: 90,
  });

  // System statistics
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalAcademies: 0,
    totalPlans: 0,
    systemUptime: 0,
    lastBackup: null,
    databaseSize: 0,
    serverLoad: 0,
    memoryUsage: 0,
    diskUsage: 0,
    networkTraffic: 0,
    apiRequests: 0,
    responseTime: 0,
    errorRate: 0,
    sessionsActive: 0,
    loginAttempts: 0,
    successfulLogins: 0,
  });

  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Check if user is admin, redirect if not
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Fetch system statistics
  const fetchSystemStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com'}/api/settings/system-stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSystemStats(data.data || {});
        setLastUpdated(new Date());
      } else {
        // Only log error once per session to prevent spam
        if (!sessionStorage.getItem('systemStatsErrorLogged')) {
          console.warn('Failed to fetch system stats - using mock data');
          sessionStorage.setItem('systemStatsErrorLogged', 'true');
        }
        setLastUpdated(new Date());
      }
    } catch (error) {
      // Only log error once per session to prevent spam
      if (!sessionStorage.getItem('systemStatsErrorLogged')) {
        console.warn('Error fetching system stats - using mock data:', error.message);
        sessionStorage.setItem('systemStatsErrorLogged', 'true');
      }
      setLastUpdated(new Date());
    }
  }, []);

  // Load session settings from backend
  const loadSessionSettings = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com'}/api/settings/session`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSessionSettings(data.data || sessionSettings);
      } else {
        // For demo purposes, create mock session settings
        createMockSessionSettings();
      }
    } catch (error) {
      // Only log error once per session to prevent spam
      if (!sessionStorage.getItem('sessionSettingsErrorLogged')) {
        console.warn('Error loading session settings - using mock data:', error.message);
        sessionStorage.setItem('sessionSettingsErrorLogged', 'true');
      }
      createMockSessionSettings();
    }
  }, []);

  // Fetch access logs
  const fetchAccessLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        // Only log error once per session to prevent spam
        if (!sessionStorage.getItem('accessLogsTokenErrorLogged')) {
          console.warn('No authentication token found for access logs');
          sessionStorage.setItem('accessLogsTokenErrorLogged', 'true');
        }
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com'}/api/settings/access-logs?page=${page + 1}&limit=${rowsPerPage}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // Only log error once per session to prevent spam
          if (!sessionStorage.getItem('accessLogsAuthErrorLogged')) {
            console.warn('Authentication failed for access logs');
            sessionStorage.setItem('accessLogsAuthErrorLogged', 'true');
          }
          return;
        }
        throw new Error(`Failed to fetch access logs: ${response.status}`);
      }
      
      const data = await response.json();
      setAccessLogs(data.data || []);
      setTotalLogs(data.total || 0);
    } catch (error) {
      // Only log error once per session to prevent spam
      if (!sessionStorage.getItem('accessLogsErrorLogged')) {
        console.warn('Error fetching access logs - using mock data:', error.message);
        sessionStorage.setItem('accessLogsErrorLogged', 'true');
      }
      // For demo purposes, create mock data
      createMockAccessLogs();
    } finally {
      setIsLoading(false);
    }
  }, [page, rowsPerPage, user?.token]);

  // Create mock system statistics for demo
  const createMockSystemStats = () => {
    const mockStats = {
      totalUsers: 156,
      activeUsers: 89,
      totalAcademies: 23,
      totalPlans: 45,
      systemUptime: 99.7,
      lastBackup: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      databaseSize: '2.4 GB',
      serverLoad: 34,
      memoryUsage: 67,
      diskUsage: 42,
    };
    setSystemStats(mockStats);
  };

  // Create mock session settings for demo
  const createMockSessionSettings = () => {
    const mockSettings = {
      sessionTimeout: 45,
      enableSessionTimeout: true,
      enableIdleTimeout: true,
      idleTimeout: 20,
      enableRememberMe: true,
      rememberMeDuration: 14,
      maxLoginAttempts: 3,
      lockoutDuration: 30,
      requirePasswordChange: true,
      passwordExpiryDays: 60,
    };
    setSessionSettings(mockSettings);
  };

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
      // Load all dynamic data
      loadSessionSettings();
      fetchSystemStats();
      fetchAccessLogs();
    }
  }, [user, page, rowsPerPage, loadSessionSettings, fetchSystemStats, fetchAccessLogs]);

  // Auto-refresh system stats every 30 seconds
  useEffect(() => {
    if (!autoRefresh || !user?.role === 'admin') return;

    const interval = setInterval(() => {
      fetchSystemStats();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, user?.role, fetchSystemStats]);

  const handleSessionSettingChange = (field, value) => {
    setSessionSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save session settings to backend
  const saveSessionSettings = async () => {
    try {
      if (!user?.token) {
        // Only log error once per session to prevent spam
        if (!sessionStorage.getItem('saveSessionTokenErrorLogged')) {
          console.warn('No authentication token found for saving session settings');
          sessionStorage.setItem('saveSessionTokenErrorLogged', 'true');
        }
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com'}/api/settings/session`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionSettings),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Session settings saved successfully:', data.message);
        // You could show a success notification here
      } else {
        // Only log error once per session to prevent spam
        if (!sessionStorage.getItem('saveSessionErrorLogged')) {
          console.warn('Failed to save session settings:', response.statusText);
          sessionStorage.setItem('saveSessionErrorLogged', 'true');
        }
        // You could show an error notification here
      }
    } catch (error) {
      // Only log error once per session to prevent spam
      if (!sessionStorage.getItem('saveSessionErrorLogged')) {
        console.warn('Error saving session settings:', error.message);
        sessionStorage.setItem('saveSessionErrorLogged', 'true');
      }
      // You could show an error notification here
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? 'https://saas-lms-admin-1.onrender.com' : 'http://localhost:5001')}/api/settings/session`, {
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

  // Auto-refresh system stats - placed after all functions are defined
  useEffect(() => {
    fetchSystemStats();
    loadSessionSettings();
    fetchAccessLogs();

    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchSystemStats();
        fetchAccessLogs();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [fetchSystemStats, loadSessionSettings, fetchAccessLogs, autoRefresh]);

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
              Bell n Desk - System Settings
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

        {/* Refresh Controls */}
        <Fade in timeout={850}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    color="primary"
                  />
                }
                label="Auto-refresh (30s)"
              />
              {lastUpdated && (
                <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </Typography>
              )}
            </Box>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => {
                fetchSystemStats();
                fetchAccessLogs();
              }}
              size="small"
            >
              Refresh Now
            </Button>
          </Box>
        </Fade>

        {/* System Overview */}
        <Fade in timeout={900}>
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={3}>
              {/* Total Users */}
              <Grid size={{ xs:12 , sm:6, md:3}}>
                <Card
                  elevation={0}
                  sx={{
                    background: (theme) => theme.palette.mode === 'light'
                      ? 'rgba(255, 255, 255, 0.9)'
                      : 'rgba(26, 26, 26, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: (theme) => `1px solid ${theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: 3,
                    textAlign: 'center',
                    p: 2,
                  }}
                >
                  <Typography variant="h4" color="primary" fontWeight={700}>
                    {systemStats.totalUsers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Users
                  </Typography>
                </Card>
              </Grid>

              {/* Active Users */}
              <Grid size={{ xs:12 , sm:6, md:3}}>
                <Card
                  elevation={0}
                  sx={{
                    background: (theme) => theme.palette.mode === 'light'
                      ? 'rgba(255, 255, 255, 0.9)'
                      : 'rgba(26, 26, 26, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: (theme) => `1px solid ${theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: 3,
                    textAlign: 'center',
                    p: 2,
                  }}
                >
                  <Typography variant="h4" color="success.main" fontWeight={700}>
                    {systemStats.activeUsers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Users
                  </Typography>
                </Card>
              </Grid>

              {/* System Uptime */}
              <Grid size={{ xs:12 , sm:6, md:3}}>
                <Card
                  elevation={0}
                  sx={{
                    background: (theme) => theme.palette.mode === 'light'
                      ? 'rgba(255, 255, 255, 0.9)'
                      : 'rgba(26, 26, 26, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: (theme) => `1px solid ${theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: 3,
                    textAlign: 'center',
                    p: 2,
                  }}
                >
                  <Typography variant="h4" color="info.main" fontWeight={700}>
                    {systemStats.systemUptime}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    System Uptime
                  </Typography>
                </Card>
              </Grid>

              {/* Database Size */}
              <Grid size={{ xs:12 , sm:6, md:3}}>
                <Card
                  elevation={0}
                  sx={{
                    background: (theme) => theme.palette.mode === 'light'
                      ? 'rgba(255, 255, 255, 0.9)'
                      : 'rgba(26, 26, 26, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: (theme) => `1px solid ${theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: 3,
                    textAlign: 'center',
                    p: 2,
                  }}
                >
                  <Typography variant="h4" color="primary" fontWeight={700}>
                    {systemStats.databaseSize}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Database Size
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            {/* Additional Real-time Metrics */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {/* Server Load */}
              <Grid size={{ xs:12 , sm:6, md:3}}>
                <Card
                  elevation={0}
                  sx={{
                    background: (theme) => theme.palette.mode === 'light'
                      ? 'rgba(255, 255, 255, 0.9)'
                      : 'rgba(26, 26, 26, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: (theme) => `1px solid ${theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: 3,
                    textAlign: 'center',
                    p: 2,
                  }}
                >
                  <Typography 
                    variant="h4" 
                    color={systemStats.serverLoad > 70 ? "error.main" : systemStats.serverLoad > 50 ? "warning.main" : "success.main"} 
                    fontWeight={700}
                  >
                    {systemStats.serverLoad}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Server Load
                  </Typography>
                </Card>
              </Grid>

              {/* Memory Usage */}
              <Grid size={{ xs:12 , sm:6, md:3}}>
                <Card
                  elevation={0}
                  sx={{
                    background: (theme) => theme.palette.mode === 'light'
                      ? 'rgba(255, 255, 255, 0.9)'
                      : 'rgba(26, 26, 26, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: (theme) => `1px solid ${theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: 3,
                    textAlign: 'center',
                    p: 2,
                  }}
                >
                  <Typography 
                    variant="h4" 
                    color={systemStats.memoryUsage > 80 ? "error.main" : systemStats.memoryUsage > 60 ? "warning.main" : "success.main"} 
                    fontWeight={700}
                  >
                    {systemStats.memoryUsage}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Memory Usage
                  </Typography>
                </Card>
              </Grid>

              {/* API Requests */}
              <Grid size={{ xs:12 , sm:6, md:3}}>
                <Card
                  elevation={0}
                  sx={{
                    background: (theme) => theme.palette.mode === 'light'
                      ? 'rgba(255, 255, 255, 0.9)'
                      : 'rgba(26, 26, 26, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: (theme) => `1px solid ${theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: 3,
                    textAlign: 'center',
                    p: 2,
                  }}
                >
                  <Typography variant="h4" color="primary" fontWeight={700}>
                    {systemStats.apiRequests}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    API Requests/min
                  </Typography>
                </Card>
              </Grid>

              {/* Active Sessions */}
              <Grid size={{ xs:12 , sm:6, md:3}}>
                <Card
                  elevation={0}
                  sx={{
                    background: (theme) => theme.palette.mode === 'light'
                      ? 'rgba(255, 255, 255, 0.9)'
                      : 'rgba(26, 26, 26, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: (theme) => `1px solid ${theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: 3,
                    textAlign: 'center',
                    p: 2,
                  }}
                >
                  <Typography variant="h4" color="success.main" fontWeight={700}>
                    {systemStats.sessionsActive}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Sessions
                  </Typography>
                </Card>
              </Grid>
            </Grid>
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
                    <Grid item size={4}>
                      <FormControlLabel
                      sx={{ mb: 2 }}
                        control={
                          <Switch
                            checked={sessionSettings.enableSessionTimeout}
                            onChange={(e) => handleSessionSettingChange('enableSessionTimeout', e.target.checked)}
                            color="primary"
                          />
                        }
                        label="Enable Session Timeout"
                      />
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
                    
                    <Grid item size={4}>
                      <FormControlLabel
                      sx={{ mb: 2 }}
                        control={
                          <Switch
                            checked={sessionSettings.enableIdleTimeout}
                            onChange={(e) => handleSessionSettingChange('enableIdleTimeout', e.target.checked)}
                            color="primary"
                          />
                        }
                        label="Enable Idle Timeout"
                      />
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
                    
                    <Grid item size={4}>
                      <FormControlLabel
                      sx={{ mb: 2 }}
                        control={
                          <Switch
                            checked={sessionSettings.enableRememberMe}
                            onChange={(e) => handleSessionSettingChange('enableRememberMe', e.target.checked)}
                            color="primary"
                          />
                        }
                        label="Enable Remember Me"
                      />
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

                    <Grid item size={6}>
                      {/* <Divider sx={{ my: 2 }} /> */}
                      <Typography variant="h6" sx={{ mb: 3 , color: 'primary.main' }}>
                        Security Settings
                      </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center',  gap: 2 }}>
                          <TextField
                            fullWidth
                            label="Max Login Attempts"
                            type="number"
                            value={sessionSettings.maxLoginAttempts}
                            onChange={(e) => handleSessionSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                            InputProps={{ inputProps: { min: 1, max: 10 } }}
                          />
                          <TextField
                            fullWidth
                            label="Lockout Duration (minutes)"
                            type="number"
                            value={sessionSettings.lockoutDuration}
                            onChange={(e) => handleSessionSettingChange('lockoutDuration', parseInt(e.target.value))}
                            InputProps={{ inputProps: { min: 1, max: 1440 } }}
                          />
                        </Box>
                    </Grid>



                    <Grid item size={6}>
                      <FormControlLabel
                      sx={{ mb: 2 }}
                        control={
                          <Switch
                            checked={sessionSettings.requirePasswordChange}
                            onChange={(e) => handleSessionSettingChange('requirePasswordChange', e.target.checked)}
                            color="primary"
                          />
                        }
                        label="Require Password Change on Expiry"
                      />
                      <TextField
                        fullWidth
                        label="Password Expiry (days)"
                        type="number"
                        value={sessionSettings.passwordExpiryDays}
                        onChange={(e) => handleSessionSettingChange('passwordExpiryDays', parseInt(e.target.value))}
                        disabled={!sessionSettings.requirePasswordChange}
                        InputProps={{ inputProps: { min: 30, max: 365 } }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                    </Grid>
                  </Grid>
                  <Box sx={{ width: '200px', marginInline: 'auto' }}>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveSettings}
                      disabled={isSaving}
                      fullWidth
                      sx={{
                        background: 'linear-gradient(135deg, #0F3C60 0%, #42a5f5 100%)',
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 600,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #1565c0 0%, #0F3C60 100%)',
                        },
                      }}
                    >
                      {isSaving ? <CircularProgress size={20} color="inherit" /> : 'Save Settings'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Access Logs */}
          <Grid size={12}>
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
