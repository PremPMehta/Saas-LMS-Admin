import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  IconButton,
  Switch,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  InputBase,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  FlashOn as FlashIcon,
  Description as DescriptionIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Chat as ChatIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
  Mic as MicIcon,
  FilterList as FilterIcon,
  KeyboardArrowUp as ArrowUpIcon,
  WbSunny as SunIcon,
  DarkMode as DarkIcon,
} from '@mui/icons-material';

const CommunityDashboard = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [activeNav, setActiveNav] = useState('home');

  const navItems = [
    { id: 'home', icon: <HomeIcon />, label: 'Home' },
    { id: 'dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
    { id: 'analytics', icon: <FlashIcon />, label: 'Analytics' },
    { id: 'content', icon: <DescriptionIcon />, label: 'Content' },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: darkMode ? '#1a1a1a' : '#f8f9fa',
      display: 'flex'
    }}>
      {/* Left Navigation Bar */}
      <Box sx={{
        width: 80,
        background: darkMode ? '#2d2d2d' : '#ffffff',
        borderRight: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 2,
        position: 'fixed',
        height: '100vh',
        zIndex: 1000,
      }}>
        {/* Hamburger Menu */}
        <IconButton sx={{ mb: 4, color: darkMode ? '#ffffff' : '#000000' }}>
          <MenuIcon />
        </IconButton>

        {/* Navigation Items */}
        {navItems.map((item) => (
          <Box key={item.id} sx={{ mb: 2, position: 'relative' }}>
            <IconButton
              onClick={() => setActiveNav(item.id)}
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: activeNav === item.id 
                  ? (darkMode ? '#404040' : '#000000')
                  : 'transparent',
                color: activeNav === item.id 
                  ? '#ffffff' 
                  : (darkMode ? '#ffffff' : '#000000'),
                '&:hover': {
                  backgroundColor: activeNav === item.id 
                    ? (darkMode ? '#404040' : '#000000')
                    : (darkMode ? '#404040' : '#f0f0f0'),
                }
              }}
            >
              {item.icon}
            </IconButton>
          </Box>
        ))}

        {/* Logout Button */}
        <Box sx={{ mt: 'auto', mb: 2 }}>
          <IconButton sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
            <ArrowBackIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ 
        flex: 1, 
        ml: 10, // Account for fixed sidebar
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Top Header */}
        <Box sx={{
          height: 80,
          background: darkMode ? '#2d2d2d' : '#ffffff',
          borderBottom: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 4,
          position: 'sticky',
          top: 0,
          zIndex: 999,
        }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ 
              bgcolor: '#4285f4', 
              mr: 2,
              width: 40,
              height: 40
            }}>
              <DashboardIcon />
            </Avatar>
            <Typography variant="h6" sx={{ 
              fontWeight: 700,
              color: darkMode ? '#ffffff' : '#000000'
            }}>
              Community Hub
            </Typography>
          </Box>

          {/* Center - Theme Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SunIcon sx={{ fontSize: 20, color: darkMode ? '#666666' : '#ffd700' }} />
            <Switch
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#4285f4',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#4285f4',
                },
              }}
            />
            <DarkIcon sx={{ fontSize: 20, color: darkMode ? '#4285f4' : '#666666' }} />
          </Box>

          {/* Right - Search and Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
              <SearchIcon />
            </IconButton>
            <IconButton sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
              <NotificationsIcon />
            </IconButton>
            <Avatar sx={{ 
              width: 40, 
              height: 40,
              bgcolor: '#34a853'
            }}>
              <PeopleIcon />
            </Avatar>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, p: 4 }}>
          {/* Top Section - Greeting and Metrics */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Greeting */}
            <Grid item xs={12} md={4}>
              <Card sx={{
                background: darkMode ? '#2d2d2d' : '#ffffff',
                border: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
                borderRadius: 3,
                height: '100%'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 700,
                    color: darkMode ? '#ffffff' : '#000000',
                    mb: 1
                  }}>
                    Good morning, Community Owner!
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: darkMode ? '#cccccc' : '#666666'
                  }}>
                    Let's make this day productive for your community.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Metrics */}
            <Grid item xs={12} md={4}>
              <Card sx={{
                background: darkMode ? '#2d2d2d' : '#ffffff',
                border: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
                borderRadius: 3,
                height: '100%'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ 
                          fontWeight: 700,
                          color: '#34a853',
                          mb: 0.5
                        }}>
                          1,247
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: darkMode ? '#cccccc' : '#666666'
                        }}>
                          Total Members
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                          <TrendingUpIcon sx={{ fontSize: 16, color: '#34a853', mr: 0.5 }} />
                          <Typography variant="caption" sx={{ color: '#34a853' }}>
                            +12%
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ 
                          fontWeight: 700,
                          color: '#4285f4',
                          mb: 0.5
                        }}>
                          89%
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: darkMode ? '#cccccc' : '#666666'
                        }}>
                          Engagement Rate
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                          <TrendingUpIcon sx={{ fontSize: 16, color: '#4285f4', mr: 0.5 }} />
                          <Typography variant="caption" sx={{ color: '#4285f4' }}>
                            +5%
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Add Course Button */}
            <Grid item xs={12} md={4}>
              <Card sx={{
                background: darkMode ? '#2d2d2d' : '#ffffff',
                border: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
                borderRadius: 3,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/create-course')}
                    sx={{
                      background: '#000000',
                      color: '#ffffff',
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        background: '#333333',
                      }
                    }}
                  >
                    Add Course
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Middle Section - Chat and Activity */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Virtual Assistant Chat */}
            <Grid item xs={12} md={6}>
              <Card sx={{
                background: darkMode ? '#2d2d2d' : '#ffffff',
                border: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
                borderRadius: 3,
                height: 400
              }}>
                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600,
                      color: darkMode ? '#ffffff' : '#000000'
                    }}>
                      Community Assistant
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small" sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
                        <HelpIcon />
                      </IconButton>
                      <IconButton size="small" sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
                        <ChatIcon />
                      </IconButton>
                      <IconButton size="small" sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
                        <SettingsIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Chat Content */}
                  <Box sx={{ flex: 1, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                      <Avatar sx={{ 
                        bgcolor: '#9c27b0',
                        width: 32,
                        height: 32
                      }}>
                        <ChatIcon />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ 
                          color: darkMode ? '#ffffff' : '#000000',
                          mb: 0.5
                        }}>
                          Hi there! I'm your community assistant. How can I help you today?
                        </Typography>
                        <Typography variant="caption" sx={{ 
                          color: darkMode ? '#cccccc' : '#666666'
                        }}>
                          9:32 AM
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Input Area */}
                  <Paper sx={{
                    p: 2,
                    background: darkMode ? '#404040' : '#f5f5f5',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <InputBase
                      placeholder="Write a message..."
                      sx={{
                        flex: 1,
                        color: darkMode ? '#ffffff' : '#000000',
                        '& input::placeholder': {
                          color: darkMode ? '#cccccc' : '#666666',
                        }
                      }}
                    />
                    <IconButton size="small" sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
                      <AttachFileIcon />
                    </IconButton>
                    <IconButton size="small" sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
                      <EmojiIcon />
                    </IconButton>
                    <IconButton size="small" sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
                      <MicIcon />
                    </IconButton>
                  </Paper>
                </CardContent>
              </Card>
            </Grid>

            {/* Activity Timeline */}
            <Grid item xs={12} md={6}>
              <Card sx={{
                background: darkMode ? '#2d2d2d' : '#ffffff',
                border: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
                borderRadius: 3,
                height: 400
              }}>
                <CardContent sx={{ p: 3, height: '100%' }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600,
                        color: darkMode ? '#ffffff' : '#000000'
                      }}>
                        Community Activity
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: darkMode ? '#cccccc' : '#666666'
                      }}>
                        What's happening today
                      </Typography>
                    </Box>
                    <IconButton sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
                      <ScheduleIcon />
                    </IconButton>
                  </Box>

                  {/* Timeline */}
                  <Box sx={{ position: 'relative' }}>
                    {/* Time markers */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      {['07:00', '09:00', '11:00', '13:00', '15:00', '17:00'].map((time) => (
                        <Typography key={time} variant="caption" sx={{ 
                          color: darkMode ? '#cccccc' : '#666666'
                        }}>
                          {time}
                        </Typography>
                      ))}
                    </Box>

                    {/* Timeline line */}
                    <Box sx={{
                      height: 4,
                      background: darkMode ? '#404040' : '#e0e0e0',
                      borderRadius: 2,
                      position: 'relative',
                      mb: 3
                    }}>
                      {/* Current time indicator */}
                      <Box sx={{
                        position: 'absolute',
                        left: '50%',
                        top: -4,
                        width: 12,
                        height: 12,
                        background: '#4285f4',
                        borderRadius: '50%',
                        border: '2px solid #ffffff'
                      }} />
                    </Box>

                    {/* Events */}
                    <List sx={{ p: 0 }}>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <Box sx={{
                          width: '100%',
                          p: 2,
                          background: '#e8f5e8',
                          borderRadius: 2,
                          border: '1px solid #4caf50'
                        }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                            New Course Published
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#666666' }}>
                            "Advanced React Patterns" by John Doe
                          </Typography>
                        </Box>
                      </ListItem>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <Box sx={{
                          width: '100%',
                          p: 2,
                          background: '#fff3e0',
                          borderRadius: 2,
                          border: '1px solid #ff9800'
                        }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                            Community Meeting
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#666666' }}>
                            Weekly Q&A Session - 45 members joined
                          </Typography>
                        </Box>
                      </ListItem>
                    </List>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Bottom Section - Tasks and Analytics */}
          <Grid container spacing={3}>
            {/* To-do List */}
            <Grid item xs={12} md={6}>
              <Card sx={{
                background: darkMode ? '#2d2d2d' : '#ffffff',
                border: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
                borderRadius: 3
              }}>
                <CardContent sx={{ p: 3 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600,
                        color: darkMode ? '#ffffff' : '#000000'
                      }}>
                        To-do List
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: darkMode ? '#cccccc' : '#666666'
                      }}>
                        Wednesday, 27 Aug
                      </Typography>
                    </Box>
                    <IconButton sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
                      <ArrowUpIcon />
                    </IconButton>
                  </Box>

                  {/* Tasks */}
                  <List sx={{ p: 0 }}>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon>
                        <CheckCircleIcon sx={{ color: '#4caf50' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Review Course Content"
                        secondary="Landing page redesign feedback"
                        sx={{
                          '& .MuiListItemText-primary': {
                            color: darkMode ? '#ffffff' : '#000000',
                            fontWeight: 500
                          },
                          '& .MuiListItemText-secondary': {
                            color: darkMode ? '#cccccc' : '#666666'
                          }
                        }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" sx={{ 
                          color: darkMode ? '#cccccc' : '#666666'
                        }}>
                          Today 2:00 PM
                        </Typography>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: '#4285f4' }}>
                          <PeopleIcon sx={{ fontSize: 14 }} />
                        </Avatar>
                      </Box>
                    </ListItem>
                    <Divider sx={{ my: 1 }} />
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon>
                        <Box sx={{
                          width: 20,
                          height: 20,
                          border: '2px solid #e0e0e0',
                          borderRadius: '50%'
                        }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Update Community Guidelines"
                        secondary="Review and publish new rules"
                        sx={{
                          '& .MuiListItemText-primary': {
                            color: darkMode ? '#ffffff' : '#000000',
                            fontWeight: 500
                          },
                          '& .MuiListItemText-secondary': {
                            color: darkMode ? '#cccccc' : '#666666'
                          }
                        }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" sx={{ 
                          color: darkMode ? '#cccccc' : '#666666'
                        }}>
                          Tomorrow 10:00 AM
                        </Typography>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: '#ff9800' }}>
                          <PeopleIcon sx={{ fontSize: 14 }} />
                        </Avatar>
                      </Box>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Analytics Summary */}
            <Grid item xs={12} md={6}>
              <Card sx={{
                background: darkMode ? '#2d2d2d' : '#ffffff',
                border: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`,
                borderRadius: 3
              }}>
                <CardContent sx={{ p: 3 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600,
                        color: darkMode ? '#ffffff' : '#000000'
                      }}>
                        Summary
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: darkMode ? '#cccccc' : '#666666'
                      }}>
                        Track your performance
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small" sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
                        <FilterIcon />
                      </IconButton>
                      <IconButton size="small" sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
                        <ArrowUpIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Performance Graph */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ 
                        color: darkMode ? '#cccccc' : '#666666'
                      }}>
                        Member Growth
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: '#34a853',
                        fontWeight: 600
                      }}>
                        +15%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={75}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: darkMode ? '#404040' : '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #34a853, #4285f4)',
                          borderRadius: 4,
                        }
                      }}
                    />
                  </Box>

                  {/* Stats */}
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 2, background: darkMode ? '#404040' : '#f5f5f5', borderRadius: 2 }}>
                        <Typography variant="h4" sx={{ 
                          fontWeight: 700,
                          color: '#4285f4',
                          mb: 0.5
                        }}>
                          24
                        </Typography>
                        <Typography variant="caption" sx={{ 
                          color: darkMode ? '#cccccc' : '#666666'
                        }}>
                          Active Courses
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 2, background: darkMode ? '#404040' : '#f5f5f5', borderRadius: 2 }}>
                        <Typography variant="h4" sx={{ 
                          fontWeight: 700,
                          color: '#34a853',
                          mb: 0.5
                        }}>
                          156
                        </Typography>
                        <Typography variant="caption" sx={{ 
                          color: darkMode ? '#cccccc' : '#666666'
                        }}>
                          New Members
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default CommunityDashboard;
