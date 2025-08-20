import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  LinearProgress,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Category as CategoryIcon,
  Settings as SettingsIcon,
  Check as CheckIcon,
  Visibility as VisibilityIcon,
  Lock as LockIcon,
  Public as PublicIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const steps = ['Community Details', 'Category & Audience', 'Choose Your Plan', 'Review & Launch'];

const categories = [
  { id: 'tech', label: '💻 Technology', description: 'Programming, AI, Web Development', color: '#2196f3' },
  { id: 'business', label: '💼 Business', description: 'Entrepreneurship, Marketing, Sales', color: '#4caf50' },
  { id: 'creative', label: '🎨 Creative', description: 'Design, Art, Photography', color: '#ff9800' },
  { id: 'health', label: '🏃 Health & Fitness', description: 'Wellness, Nutrition, Exercise', color: '#f44336' },
  { id: 'education', label: '📚 Education', description: 'Teaching, Learning, Academia', color: '#9c27b0' },
  { id: 'lifestyle', label: '🌟 Lifestyle', description: 'Personal Development, Hobbies', color: '#607d8b' }
];

const CreateCommunity = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    audience: '',
    selectedPlan: '',
    welcomeMessage: ''
  });
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch subscription plans from API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://saas-lms-admin.onrender.com';
        const response = await fetch(`${API_BASE_URL}/api/plans`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch plans');
        }
        
        const data = await response.json();
        setSubscriptionPlans(data.plans || data);
        setError('');
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError('Failed to load subscription plans');
        // Fallback to static plans
        setSubscriptionPlans([
          { _id: 'basic', name: 'Basic', price: '$19', features: ['Up to 100 members', 'Basic community features', 'Email support'], popular: false, limits: '1 academy, 100 students' },
          { _id: 'pro', name: 'Pro', price: '$49', features: ['Up to 1000 members', 'Advanced features', 'Priority support', 'Analytics'], popular: true, limits: '5 academies, 1000 students' },
          { _id: 'enterprise', name: 'Enterprise', price: '$99', features: ['Unlimited members', 'All premium features', '24/7 support', 'Custom branding'], popular: false, limits: 'Unlimited academies and students' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Container maxWidth="md">
            <Paper elevation={0} sx={{ p: 6, borderRadius: 4, border: '1px solid #f0f0f0' }}>
              <Box sx={{ textAlign: 'center', mb: 5 }}>
                <Avatar sx={{ bgcolor: '#667eea', width: 80, height: 80, mx: 'auto', mb: 3 }}>
                  <SchoolIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#1a1a1a' }}>
                  Create Your Community
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
                  Give your community a compelling name and description that attracts the right members
                </Typography>
              </Box>

              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
                    Community Name *
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="e.g., React Developers Hub, Digital Marketing Masters"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        fontSize: '1.2rem',
                        py: 1
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
                    Description *
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={5}
                    placeholder="Describe what your community is about, what members will learn, and what makes it special. Be specific about the value you'll provide..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        fontSize: '1.1rem'
                      }
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      A good description helps potential members understand your community's value
                    </Typography>
                    <Typography variant="caption" color={formData.description.length > 400 ? 'error' : 'text.secondary'}>
                      {formData.description.length}/500
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Container>
        );

      case 1:
        return (
          <Container maxWidth="lg">
            <Paper elevation={0} sx={{ p: 6, borderRadius: 4, border: '1px solid #f0f0f0' }}>
              <Box sx={{ textAlign: 'center', mb: 5 }}>
                <Avatar sx={{ bgcolor: '#667eea', width: 80, height: 80, mx: 'auto', mb: 3 }}>
                  <CategoryIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#1a1a1a' }}>
                  Choose Category & Audience
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                  Select the category that best fits your community and define your target audience
                </Typography>
              </Box>

              <Box sx={{ mb: 5 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#333', textAlign: 'center' }}>
                  Select Category
                </Typography>
                <Grid container spacing={3}>
                  {categories.map((category) => (
                    <Grid item xs={12} md={6} lg={4} key={category.id}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          border: formData.category === category.id ? `3px solid ${category.color}` : '2px solid #f0f0f0',
                          borderRadius: 4,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                            borderColor: category.color
                          },
                          position: 'relative',
                          overflow: 'visible'
                        }}
                        onClick={() => handleInputChange('category', category.id)}
                      >
                        {formData.category === category.id && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: -10,
                              right: -10,
                              bgcolor: category.color,
                              borderRadius: '50%',
                              width: 40,
                              height: 40,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: 3
                            }}
                          >
                            <CheckIcon sx={{ color: 'white', fontSize: 20 }} />
                          </Box>
                        )}
                        <CardContent sx={{ p: 4, textAlign: 'center' }}>
                          <Typography variant="h4" sx={{ mb: 2 }}>
                            {category.label}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            {category.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Box>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#333', textAlign: 'center' }}>
                  Target Audience
                </Typography>
                <TextField
                  fullWidth
                  placeholder="e.g., Beginner developers, Marketing professionals, Creative entrepreneurs..."
                  value={formData.audience}
                  onChange={(e) => handleInputChange('audience', e.target.value)}
                  sx={{
                    maxWidth: 600,
                    mx: 'auto',
                    display: 'block',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      fontSize: '1.1rem',
                      py: 1.5
                    }
                  }}
                />
              </Box>
            </Paper>
          </Container>
        );

      case 2:
        return (
          <Container maxWidth="lg">
            <Paper elevation={0} sx={{ p: 6, borderRadius: 4, border: '1px solid #f0f0f0' }}>
              <Box sx={{ textAlign: 'center', mb: 5 }}>
                <Avatar sx={{ bgcolor: '#667eea', width: 80, height: 80, mx: 'auto', mb: 3 }}>
                  <SettingsIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#1a1a1a' }}>
                  Choose Your Plan
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                  Select the subscription plan that best fits your community's needs
                </Typography>
              </Box>

              {error && (
                <Alert severity="warning" sx={{ mb: 4, borderRadius: 2 }}>
                  {error} - Using fallback plans
                </Alert>
              )}

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress size={60} />
                </Box>
              ) : (
                <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
                  {subscriptionPlans.map((plan) => (
                    <Grid item xs={12} md={6} lg={4} key={plan._id}>
                      <Badge
                        badgeContent={plan.popular ? "POPULAR" : ""}
                        color="error"
                        sx={{
                          width: '100%',
                          '& .MuiBadge-badge': {
                            top: 20,
                            right: 20,
                            fontSize: '0.7rem',
                            fontWeight: 700
                          }
                        }}
                      >
                        <Card
                          sx={{
                            cursor: 'pointer',
                            border: formData.selectedPlan === plan._id ? '3px solid #667eea' : '2px solid #f0f0f0',
                            borderRadius: 4,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-8px)',
                              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                              borderColor: '#667eea'
                            },
                            position: 'relative',
                            height: '100%',
                            ...(plan.popular && {
                              transform: 'scale(1.05)',
                              boxShadow: '0 15px 50px rgba(102, 126, 234, 0.3)'
                            })
                          }}
                          onClick={() => handleInputChange('selectedPlan', plan._id)}
                        >
                          <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ textAlign: 'center', mb: 3 }}>
                              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#333' }}>
                                {plan.name}
                              </Typography>
                              <Typography variant="h2" sx={{ fontWeight: 800, color: '#667eea', mb: 1 }}>
                                {plan.price}
                              </Typography>
                              <Typography variant="body1" color="text.secondary">
                                per month
                              </Typography>
                              {plan.limits && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                                  {plan.limits}
                                </Typography>
                              )}
                            </Box>

                            <Divider sx={{ mb: 3 }} />

                            <Box sx={{ flexGrow: 1 }}>
                              <List dense>
                                {(plan.features || []).map((feature, index) => (
                                  <ListItem key={index} sx={{ px: 0 }}>
                                    <ListItemIcon sx={{ minWidth: 30 }}>
                                      <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                                    </ListItemIcon>
                                    <ListItemText 
                                      primary={feature}
                                      primaryTypographyProps={{
                                        fontSize: '0.95rem',
                                        color: '#555'
                                      }}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </Box>

                            {formData.selectedPlan === plan._id && (
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: -10,
                                  right: -10,
                                  bgcolor: '#667eea',
                                  borderRadius: '50%',
                                  width: 40,
                                  height: 40,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  boxShadow: 3
                                }}
                              >
                                <CheckIcon sx={{ color: 'white', fontSize: 20 }} />
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      </Badge>
                    </Grid>
                  ))}
                </Grid>
              )}

              <Box sx={{ mt: 5 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#333', textAlign: 'center' }}>
                  Welcome Message (Optional)
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Write a welcoming message for new members joining your community..."
                  value={formData.welcomeMessage}
                  onChange={(e) => handleInputChange('welcomeMessage', e.target.value)}
                  sx={{
                    maxWidth: 700,
                    mx: 'auto',
                    display: 'block',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      fontSize: '1.1rem'
                    }
                  }}
                />
              </Box>
            </Paper>
          </Container>
        );

      case 3:
        const selectedPlan = subscriptionPlans.find(p => p._id === formData.selectedPlan);
        const selectedCategory = categories.find(c => c.id === formData.category);
        
        return (
          <Container maxWidth="md">
            <Paper elevation={0} sx={{ p: 6, borderRadius: 4, border: '1px solid #f0f0f0' }}>
              <Box sx={{ textAlign: 'center', mb: 5 }}>
                <Avatar sx={{ bgcolor: '#4caf50', width: 80, height: 80, mx: 'auto', mb: 3 }}>
                  <CheckIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#1a1a1a' }}>
                  Review & Launch
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Everything looks perfect! Ready to launch your community?
                </Typography>
              </Box>

              <Card sx={{ mb: 4, borderRadius: 4, border: '2px solid #f0f0f0', overflow: 'hidden' }}>
                <Box sx={{ bgcolor: selectedCategory?.color || '#667eea', p: 3, color: 'white' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 60, height: 60 }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {formData.name.charAt(0).toUpperCase()}
                      </Typography>
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        {formData.name || 'Your Community Name'}
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        {selectedCategory?.label || 'Category'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, color: '#555' }}>
                    {formData.description || 'Your community description will appear here...'}
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
                          Target Audience
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formData.audience || 'Not specified'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
                          Subscription Plan
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedPlan?.name} - {selectedPlan?.price}/month
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, pt: 3, borderTop: '1px solid #f0f0f0' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PeopleIcon sx={{ fontSize: 20, color: '#666' }} />
                      <Typography variant="body2" color="text.secondary">
                        0 Members (Ready to grow!)
                      </Typography>
                    </Box>
                    <Chip 
                      label="Ready to Launch"
                      color="success"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </CardContent>
              </Card>

              <Box sx={{ bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', p: 4, borderRadius: 3, textAlign: 'center', color: 'white' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  🎉 Your community will be live immediately!
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  You can always modify settings and add content after launch
                </Typography>
              </Box>
            </Paper>
          </Container>
        );

      default:
        return 'Unknown step';
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case 0:
        return formData.name.trim() && formData.description.trim();
      case 1:
        return formData.category && formData.audience.trim();
      case 2:
        return formData.selectedPlan;
      default:
        return true;
    }
  };

  return (
    <Box sx={{ bgcolor: '#fafbfc', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e9ecef', py: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SchoolIcon sx={{ fontSize: 36, color: '#667eea' }} />
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 800,
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                skool
              </Typography>
            </Box>
            <Button 
              variant="outlined" 
              startIcon={<ArrowBackIcon />}
              href="/"
              sx={{ 
                textTransform: 'none',
                borderRadius: '30px',
                px: 4,
                py: 1.5,
                borderColor: '#667eea',
                color: '#667eea',
                '&:hover': {
                  bgcolor: '#667eea',
                  color: 'white'
                }
              }}
            >
              Back to Discovery
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Progress Stepper */}
        <Box sx={{ mb: 6 }}>
          <Stepper 
            activeStep={activeStep} 
            alternativeLabel
            sx={{
              '& .MuiStepLabel-root .Mui-completed': {
                color: '#4caf50'
              },
              '& .MuiStepLabel-root .Mui-active': {
                color: '#667eea'
              }
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          <LinearProgress 
            variant="determinate" 
            value={(activeStep / (steps.length - 1)) * 100} 
            sx={{ 
              mt: 3, 
              height: 8, 
              borderRadius: 4,
              bgcolor: '#f0f0f0',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#667eea'
              }
            }}
          />
        </Box>

        {/* Step Content */}
        <Box sx={{ mb: 6 }}>
          {getStepContent(activeStep)}
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
            sx={{ 
              px: 6, 
              py: 2,
              borderRadius: '30px',
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 600
            }}
          >
            Back
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={() => {
                // Here you would normally save to backend
                alert(`🎉 Community "${formData.name}" created successfully!\n\nPlan: ${subscriptionPlans.find(p => p._id === formData.selectedPlan)?.name}\nCategory: ${categories.find(c => c.id === formData.category)?.label}`);
              }}
              sx={{ 
                px: 8, 
                py: 2,
                borderRadius: '30px',
                textTransform: 'none',
                fontSize: '1.2rem',
                fontWeight: 700,
                background: 'linear-gradient(45deg, #4caf50, #45a049)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #45a049, #3d8b40)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(76, 175, 80, 0.4)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              🚀 Launch Community
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!isStepValid(activeStep)}
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                px: 6, 
                py: 2,
                borderRadius: '30px',
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a67d8, #6b46c1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
                },
                '&:disabled': {
                  background: '#ccc'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Continue
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default CreateCommunity;