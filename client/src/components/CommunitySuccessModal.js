import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  MonetizationOn as MonetizationOnIcon,
  Web as WebIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Assignment as AssignmentIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  CloudDone as CloudDoneIcon,
  Launch as LaunchIcon,
  Share as ShareIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';

const CommunitySuccessModal = ({ open, onClose, communityData }) => {
  const navigate = useNavigate();
  const data = communityData || {};

  const handleLaunchCommunity = () => {
    // Close modal first
    onClose();
    // Navigate to community setup page with clean data
    navigate('/community-setup', { 
      state: { 
        communityData: {
          name: data.name,
          description: data.description,
          category: data.category,
          plan: data.plan,
          price: data.price,
          period: data.period
        }
      }
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.1)',
            zIndex: 1,
          },
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 3,
        position: 'relative',
        zIndex: 2,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            p: 1.5,
            borderRadius: 3,
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <CheckCircleIcon sx={{ fontSize: 32, color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              🎉 Community Launched Successfully!
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Your community is now live and ready for members
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, position: 'relative', zIndex: 2 }}>
        <Grid container spacing={0}>
          {/* Left Side - Community Overview */}
          <Grid item size={{xs:12, md:6}} sx={{ p: 2 }}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Community Card */}
              <Card sx={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 3,
                mb: 3,
                color: 'white',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        background: 'rgba(255,255,255,0.2)',
                        border: '3px solid rgba(255,255,255,0.3)',
                      }}
                    >
                      <BusinessIcon sx={{ fontSize: 30 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {data.name}
                      </Typography>
                      <Chip
                        label="LIVE"
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(76, 175, 80, 0.8)',
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </Box>

                  <Typography variant="body1" sx={{ mb: 3, opacity: 0.9, lineHeight: 1.6 }}>
                    {data.description}
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <WebIcon sx={{ fontSize: 20, opacity: 0.8 }} />
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {data.fullDomain}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <AssignmentIcon sx={{ fontSize: 20, opacity: 0.8 }} />
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Category: {data.category}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Subscription Plan */}
              <Card sx={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 3,
                mb: 3,
                color: 'white',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MonetizationOnIcon />
                    Subscription Plan
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Chip
                      label={`${data.plan} - ${data.price}/${data.period}`}
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '1rem',
                        py: 1,
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Includes all premium features and unlimited resources
                  </Typography>
                </CardContent>
              </Card>

                             {/* Community Details */}
               <Card sx={{
                 background: 'rgba(255,255,255,0.1)',
                 backdropFilter: 'blur(10px)',
                 border: '1px solid rgba(255,255,255,0.2)',
                 borderRadius: 3,
                 color: 'white',
               }}>
                 <CardContent sx={{ p: 3 }}>
                   <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                     <BusinessIcon />
                     Community Details
                   </Typography>
                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                       <AssignmentIcon sx={{ fontSize: 18, opacity: 0.8 }} />
                       <Typography variant="body2" sx={{ opacity: 0.9 }}>
                         Category: {data.category || 'General'}
                       </Typography>
                     </Box>
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                       <MonetizationOnIcon sx={{ fontSize: 18, opacity: 0.8 }} />
                       <Typography variant="body2" sx={{ opacity: 0.9 }}>
                         Plan: {data.plan || 'Basic'} - {data.price || '$29'}/{data.period || 'month'}
                       </Typography>
                     </Box>
                   </Box>
                 </CardContent>
               </Card>
            </Box>
          </Grid>

          {/* Right Side - Features & Actions */}
          <Grid item size={{xs:12, md:6}}  sx={{ p: 2 }}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                             {/* Next Steps */}
               <Card sx={{
                 background: 'rgba(255,255,255,0.1)',
                 backdropFilter: 'blur(10px)',
                 border: '1px solid rgba(255,255,255,0.2)',
                 borderRadius: 3,
                 mb: 3,
                 color: 'white',
                 flex: 1,
               }}>
                 <CardContent sx={{ p: 3 }}>
                   <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                     <CheckCircleIcon />
                     Next Steps
                   </Typography>
                   <List sx={{ p: 0 }}>
                     <ListItem sx={{ px: 0, py: 1 }}>
                       <ListItemIcon sx={{ minWidth: 40 }}>
                         <CheckCircleIcon sx={{ color: 'rgba(255,255,255,0.8)', fontSize: 20 }} />
                       </ListItemIcon>
                       <ListItemText 
                         primary="Set up your subdomain"
                         sx={{
                           '& .MuiListItemText-primary': {
                             color: 'white',
                             opacity: 0.9,
                             fontSize: '0.95rem',
                           }
                         }}
                       />
                     </ListItem>
                     <ListItem sx={{ px: 0, py: 1 }}>
                       <ListItemIcon sx={{ minWidth: 40 }}>
                         <CheckCircleIcon sx={{ color: 'rgba(255,255,255,0.8)', fontSize: 20 }} />
                       </ListItemIcon>
                       <ListItemText 
                         primary="Create login credentials"
                         sx={{
                           '& .MuiListItemText-primary': {
                             color: 'white',
                             opacity: 0.9,
                             fontSize: '0.95rem',
                           }
                         }}
                       />
                     </ListItem>
                     <ListItem sx={{ px: 0, py: 1 }}>
                       <ListItemIcon sx={{ minWidth: 40 }}>
                         <CheckCircleIcon sx={{ color: 'rgba(255,255,255,0.8)', fontSize: 20 }} />
                       </ListItemIcon>
                       <ListItemText 
                         primary="Upload community logo"
                         sx={{
                           '& .MuiListItemText-primary': {
                             color: 'white',
                             opacity: 0.9,
                             fontSize: '0.95rem',
                           }
                         }}
                       />
                     </ListItem>
                     <ListItem sx={{ px: 0, py: 1 }}>
                       <ListItemIcon sx={{ minWidth: 40 }}>
                         <CheckCircleIcon sx={{ color: 'rgba(255,255,255,0.8)', fontSize: 20 }} />
                       </ListItemIcon>
                       <ListItemText 
                         primary="Launch your community"
                         sx={{
                           '& .MuiListItemText-primary': {
                             color: 'white',
                             opacity: 0.9,
                             fontSize: '0.95rem',
                           }
                         }}
                       />
                     </ListItem>
                   </List>
                 </CardContent>
               </Card>

              

                             {/* Action Buttons */}
               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                 <Button
                   fullWidth
                   variant="contained"
                   onClick={handleLaunchCommunity}
                   startIcon={<DashboardIcon />}
                   sx={{
                     py: 1.5,
                     borderRadius: 2,
                     textTransform: 'none',
                     fontWeight: 600,
                     fontSize: '1rem',
                     background: 'rgba(255,255,255,0.2)',
                     backdropFilter: 'blur(10px)',
                     border: '1px solid rgba(255,255,255,0.3)',
                     color: 'white',
                     '&:hover': {
                       background: 'rgba(255,255,255,0.3)',
                     },
                   }}
                 >
                   Complete Setup
                 </Button>
               </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default CommunitySuccessModal;
