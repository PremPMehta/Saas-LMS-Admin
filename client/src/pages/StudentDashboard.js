import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  Chip
} from '@mui/material';
import {
  School as SchoolIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Book as BookIcon
} from '@mui/icons-material';

const StudentDashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Student Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Welcome back! Here's your learning overview.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    5
                  </Typography>
                  <Typography color="text.secondary">
                    Enrolled Communities
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <BookIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    12
                  </Typography>
                  <Typography color="text.secondary">
                    Courses Completed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    48
                  </Typography>
                  <Typography color="text.secondary">
                    Hours Learned
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PeopleIcon sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    156
                  </Typography>
                  <Typography color="text.secondary">
                    Connections
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Avatar sx={{ mr: 2 }}>JS</Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1">
                      Completed "React Fundamentals" course
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      2 hours ago
                    </Typography>
                  </Box>
                  <Chip label="Completed" color="success" size="small" />
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Avatar sx={{ mr: 2 }}>ML</Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1">
                      Joined "Machine Learning Community"
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      1 day ago
                    </Typography>
                  </Box>
                  <Chip label="New" color="primary" size="small" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mb: 2 }}
                  href="/discovery"
                >
                  Discover Communities
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mb: 2 }}
                >
                  View My Courses
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                >
                  Update Profile
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StudentDashboard;
