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
  Stack
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  Category as CategoryIcon,
  Payment as PaymentIcon,
  Check as CheckIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import CommunitySuccessModal from '../components/CommunitySuccessModal';
import useDocumentTitle from '../contexts/useDocumentTitle';

const steps = ['Basic Information', 'Category Selection', 'Subscription Plan', 'Final Review'];

const categories = [
  { 
    id: 'tech', 
    label: 'Technology', 
    description: 'Software Development, AI, Data Science, Cybersecurity',
    icon: '⚡',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  { 
    id: 'business', 
    label: 'Business & Finance', 
    description: 'Entrepreneurship, Investment, Management, Strategy',
    icon: '💼',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  { 
    id: 'education', 
    label: 'Education & Training', 
    description: 'Professional Development, Certification, Skills Training',
    icon: '🎓',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  { 
    id: 'healthcare', 
    label: 'Healthcare & Wellness', 
    description: 'Medical Training, Health Sciences, Wellness Programs',
    icon: '⚕️',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  },
  { 
    id: 'creative', 
    label: 'Creative Industries', 
    description: 'Design, Media, Marketing, Content Creation',
    icon: '🎨',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  { 
    id: 'consulting', 
    label: 'Professional Services', 
    description: 'Consulting, Legal, Accounting, Advisory Services',
    icon: '🏛️',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  }
];

const CreateCommunity = () => {
  useDocumentTitle('Create Community - Bell & Desk');
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    targetAudience: '',
    selectedPlan: '',
    welcomeMessage: '',
    ownerEmail: '',
    ownerPassword: '',
    ownerName: '',
    phoneNumber: ''
  });
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [error, setError] = useState('');

  // Fetch subscription plans from API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = process.env.REACT_APP_API_URL || 
          (process.env.NODE_ENV === 'production' 
            ? 'https://saas-lms-admin-1.onrender.com' 
            : 'http://localhost:5001');
                    const response = await fetch(`${API_BASE_URL}/api/plans/public`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch plans');
        }
        
        const data = await response.json();
        setSubscriptionPlans(data.plans || data);
        setError('');
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError('Unable to load subscription plans');
        // Professional fallback plans
        setSubscriptionPlans([
          { 
            _id: 'starter', 
            name: 'Starter', 
            price: '$29', 
            features: [
              'Up to 500 members',
              'Basic community features', 
              'Email support',
              'Mobile app access',
              'Basic analytics'
            ], 
            popular: false, 
            limits: 'Perfect for small communities',
            maxAcademies: 1,
            maxStudentsPerAcademy: 500
          },
          { 
            _id: 'professional', 
            name: 'Professional', 
            price: '$79', 
            features: [
              'Up to 5,000 members',
              'Advanced community features', 
              'Priority support',
              'Custom branding',
              'Advanced analytics',
              'API access',
              'Integrations'
            ], 
            popular: true, 
            limits: 'Most popular for growing businesses',
            maxAcademies: 5,
            maxStudentsPerAcademy: 5000
          },
          { 
            _id: 'enterprise', 
            name: 'Enterprise', 
            price: '$199', 
            features: [
              'Unlimited members',
              'Enterprise features', 
              '24/7 dedicated support',
              'White-label solution',
              'Custom integrations',
              'Advanced security',
              'Compliance tools',
              'Success manager'
            ], 
            popular: false, 
            limits: 'For large organizations',
            maxAcademies: 999,
            maxStudentsPerAcademy: 999999
          }
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
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Box sx={{ mb: 6 }}>
              <Typography variant="h3" sx={{ fontWeight: 600, mb: 2, color: '#1a1a1a', textAlign: 'center' }}>
                Create Your Professional Community
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 600, mx: 'auto' }}>
                Build a thriving professional network with our enterprise-grade community platform
              </Typography>
            </Box>

            <Paper elevation={0} sx={{ p: 6, border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <Grid container spacing={4}>
                <Grid item size={12}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
                    Community Name
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter your community name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1,
                        backgroundColor: '#fafafa',
                        '&:hover': {
                          backgroundColor: '#f5f5f5'
                        }
                      }
                    }}
                  />
                </Grid>

                <Grid item size={12}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
                    Community Description
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Describe your community's purpose, goals, and what members can expect"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1,
                        backgroundColor: '#fafafa',
                        '&:hover': {
                          backgroundColor: '#f5f5f5'
                        }
                      }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {formData.description.length}/1000 characters
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
            <Box sx={{ mb: 6, textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 600, mb: 2, color: '#1a1a1a' }}>
                Select Your Industry
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Choose the category that best represents your community focus
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {categories.map((category) => (
                <Grid item size={{xs:12 , md:6}} key={category.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: formData.category === category.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                      borderRadius: 2,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                        borderColor: '#1976d2'
                      },
                      height: '100%',
                      position: 'relative'
                    }}
                    onClick={() => handleInputChange('category', category.id)}
                  >
                    <CardContent sx={{ p: 4, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: 2,
                            background: category.gradient,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px',
                            flexShrink: 0
                          }}
                        >
                          {category.icon}
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
                            {category.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            {category.description}
                          </Typography>
                        </Box>
                        {formData.category === category.id && (
                          <CheckCircleIcon sx={{ color: '#1976d2', fontSize: 28 }} />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 6 }}>
              <Paper elevation={0} sx={{ p: 4, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
                  Target Audience
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Describe your ideal community members (e.g., Senior developers, C-level executives, Healthcare professionals)"
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      backgroundColor: '#fafafa'
                    }
                  }}
                />
              </Paper>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
            <Box sx={{ mb: 6, textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 600, mb: 2, color: '#1a1a1a' }}>
                Choose Your Subscription Plan
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Select the plan that best fits your community's scale and requirements
              </Typography>
            </Box>

            {error && (
              <Alert severity="info" sx={{ mb: 4, borderRadius: 1 }}>
                {error}. Showing standard pricing options.
              </Alert>
            )}

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress size={50} />
              </Box>
            ) : (
              <Grid container spacing={4}>
                {subscriptionPlans.map((plan) => (
                  <Grid item size={{xs:12 , md:4}} key={plan._id}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        border: formData.selectedPlan === plan._id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                        borderRadius: 2,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                          borderColor: '#1976d2'
                        },
                        position: 'relative',
                        height: '100%',
                        ...(plan.popular && {
                          borderColor: '#1976d2',
                          boxShadow: '0 8px 30px rgba(25, 118, 210, 0.2)'
                        })
                      }}
                      onClick={() => handleInputChange('selectedPlan', plan._id)}
                    >
                      {plan.popular && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -1,
                            left: -1,
                            right: -1,
                            height: 4,
                            background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
                            borderRadius: '2px 2px 0 0'
                          }}
                        />
                      )}
                      
                      <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {plan.popular && (
                          <Chip 
                            label="MOST POPULAR" 
                            size="small" 
                            sx={{ 
                              mb: 2, 
                              bgcolor: '#1976d2', 
                              color: 'white',
                              fontWeight: 600,
                              alignSelf: 'flex-start'
                            }} 
                          />
                        )}

                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
                          {plan.name}
                        </Typography>
                        
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976d2' }}>
                            {plan.price}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            per month, billed annually
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                            {plan.limits}
                          </Typography>
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        <Box sx={{ flexGrow: 1 }}>
                          <List dense sx={{ p: 0 }}>
                            {(plan.features || []).map((feature, index) => (
                              <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: 28 }}>
                                  <CheckIcon sx={{ color: '#4caf50', fontSize: 18 }} />
                                </ListItemIcon>
                                <ListItemText 
                                  primary={feature}
                                  primaryTypographyProps={{
                                    fontSize: '0.9rem',
                                    color: '#555'
                                  }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>

                        {formData.selectedPlan === plan._id && (
                          <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Chip 
                              icon={<CheckIcon />}
                              label="Selected" 
                              color="primary" 
                              sx={{ fontWeight: 600 }}
                            />
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            <Box sx={{ mt: 6 }}>
              <Paper elevation={0} sx={{ p: 4, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
                  Welcome Message (Optional)
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Create a professional welcome message for new community members"
                  value={formData.welcomeMessage}
                  onChange={(e) => handleInputChange('welcomeMessage', e.target.value)}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      backgroundColor: '#fafafa'
                    }
                  }}
                />
              </Paper>
            </Box>
          </Box>
        );

      case 3:
        const selectedPlan = subscriptionPlans.find(p => p._id === formData.selectedPlan);
        const selectedCategory = categories.find(c => c.id === formData.category);
        
        return (
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Box sx={{ mb: 6, textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 600, mb: 2, color: '#1a1a1a' }}>
                Review Your Configuration
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Please review your community settings before launching
              </Typography>
            </Box>

            <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ bgcolor: '#f8f9fa', p: 4, borderBottom: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Avatar 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      bgcolor: '#1976d2',
                      fontSize: '2rem',
                      fontWeight: 600
                    }}
                  >
                    {formData.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: '#1a1a1a' }}>
                      {formData.name || 'Your Community Name'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {selectedCategory?.label || 'Category not selected'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <Box sx={{ p: 4 }}>
                <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.7, color: '#555' }}>
                  {formData.description || 'No description provided'}
                </Typography>

                <Grid container spacing={4}>
                  <Grid item size={{xs: 12 , md:4 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                        Target Audience
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formData.targetAudience || 'Not specified'}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item size={{xs: 12 , md:4 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                        Subscription Plan
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedPlan?.name} - {selectedPlan?.price}/month
                      </Typography>
                    </Box>
                  </Grid>

                  {formData.welcomeMessage && (
                    <Grid item size={{xs: 12 , md:4 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                          Welcome Message
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formData.welcomeMessage}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PeopleIcon sx={{ fontSize: 20, color: '#666' }} />
                    <Typography variant="body2" color="text.secondary">
                      Ready for members
                    </Typography>
                  </Box>
                  <Chip 
                    label="Ready to Launch"
                    color="success"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </Box>
            </Paper>

            <Paper elevation={0} sx={{ mt: 4, p: 4, bgcolor: '#f8f9fa', border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 500, textAlign: 'center', color: '#555' }}>
                Your community will be created and ready for members immediately after launch.
              </Typography>
            </Paper>
          </Box>
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
        return formData.category && formData.targetAudience.trim();
      case 2:
        return formData.selectedPlan;
      default:
        return true;
    }
  };

  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0', py: 3 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <BusinessIcon sx={{ fontSize: 32, color: '#1976d2' }} />
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  color: '#1a1a1a'
                }}
              >
                Community Platform
              </Typography>
            </Box>
            <Button 
              variant="outlined" 
              startIcon={<ArrowBackIcon />}
              href="/"
              sx={{ 
                textTransform: 'none',
                borderRadius: 1,
                px: 3,
                py: 1,
                borderColor: '#e0e0e0',
                color: '#666',
                '&:hover': {
                  borderColor: '#1976d2',
                  color: '#1976d2'
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
        <Box sx={{ mb: 8 }}>
          <Stepper 
            activeStep={activeStep} 
            alternativeLabel
            sx={{
              '& .MuiStepLabel-root .Mui-completed': {
                color: '#1976d2'
              },
              '& .MuiStepLabel-root .Mui-active': {
                color: '#1976d2'
              },
              '& .MuiStepConnector-line': {
                borderColor: '#e0e0e0'
              }
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: '#666' }}>
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
              height: 4, 
              borderRadius: 2,
              bgcolor: '#f0f0f0',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#1976d2'
              }
            }}
          />
        </Box>

        {/* Step Content */}
        <Box sx={{ mb: 8 }}>
          {getStepContent(activeStep)}
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
            sx={{ 
              px: 4, 
              py: 1.5,
              borderRadius: 1,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              color: '#666'
            }}
          >
            Previous
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={() => {
                setSuccessModalOpen(true);
              }}
              sx={{ 
                px: 6, 
                py: 1.5,
                borderRadius: 1,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                bgcolor: '#1976d2',
                '&:hover': {
                  bgcolor: '#1565c0'
                }
              }}
            >
              Launch Community
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!isStepValid(activeStep)}
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                px: 4, 
                py: 1.5,
                borderRadius: 1,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                bgcolor: '#1976d2',
                '&:hover': {
                  bgcolor: '#1565c0'
                },
                '&:disabled': {
                  bgcolor: '#e0e0e0'
                }
              }}
            >
              Continue
            </Button>
          )}
        </Box>
      </Container>

      {/* Success Modal */}
      <CommunitySuccessModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        communityData={{
          name: formData.name,
          description: formData.description,
          category: categories.find(c => c.id === formData.category)?.label || 'General',
          plan: subscriptionPlans.find(p => p._id === formData.selectedPlan)?.name || 'Basic',
          price: subscriptionPlans.find(p => p._id === formData.selectedPlan)?.price || '$29',
          period: subscriptionPlans.find(p => p._id === formData.selectedPlan)?.period || 'month',
          subdomain: formData.name?.toLowerCase().replace(/\s+/g, '') || 'mycommunity',
          fullDomain: `${formData.name?.toLowerCase().replace(/\s+/g, '') || 'mycommunity'}.bbrtek-lms.com`,
          ownerName: 'Community Owner',
          ownerEmail: 'owner@example.com',
          ownerPhone: '+1 (555) 123-4567',
          features: [
            'Unlimited members',
            'Advanced analytics',
            'Custom branding',
            'Priority support',
            'API access',
            'White-label options'
          ],
          limits: {
            maxMembers: 'Unlimited',
            maxCourses: 'Unlimited',
            storage: '100GB',
            bandwidth: 'Unlimited'
          }
        }}
      />
    </Box>
  );
};

export default CreateCommunity;