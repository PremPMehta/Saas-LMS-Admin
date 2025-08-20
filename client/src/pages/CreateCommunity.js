import React, { useState } from 'react';
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
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Category as CategoryIcon,
  Settings as SettingsIcon,
  Check as CheckIcon,
  Upload as UploadIcon,
  Visibility as VisibilityIcon,
  Lock as LockIcon,
  Public as PublicIcon
} from '@mui/icons-material';

const steps = ['Community Details', 'Category & Audience', 'Pricing & Settings', 'Review & Launch'];

const categories = [
  { id: 'tech', label: '💻 Technology', description: 'Programming, AI, Web Development' },
  { id: 'business', label: '💼 Business', description: 'Entrepreneurship, Marketing, Sales' },
  { id: 'creative', label: '🎨 Creative', description: 'Design, Art, Photography' },
  { id: 'health', label: '🏃 Health & Fitness', description: 'Wellness, Nutrition, Exercise' },
  { id: 'education', label: '📚 Education', description: 'Teaching, Learning, Academia' },
  { id: 'lifestyle', label: '🌟 Lifestyle', description: 'Personal Development, Hobbies' }
];

const pricingOptions = [
  { id: 'free', label: 'Free', price: '$0', description: 'Open to everyone', icon: <PublicIcon /> },
  { id: 'paid', label: 'Paid', price: 'Custom', description: 'Monthly subscription', icon: <LockIcon /> },
  { id: 'application', label: 'Application Only', price: '$0', description: 'Approval required', icon: <VisibilityIcon /> }
];

const CreateCommunity = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    audience: '',
    pricing: 'free',
    monthlyPrice: '',
    privacy: 'public',
    rules: '',
    welcomeMessage: ''
  });

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
          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <SchoolIcon sx={{ fontSize: 48, color: '#4285f4', mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                Let's create your community
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Give your community a name and describe what it's about
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Community Name *
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g., React Developers Hub"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontSize: '1.1rem'
                  }
                }}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Description *
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Describe what your community is about, what members will learn, and what makes it special..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {formData.description.length}/500 characters
              </Typography>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ maxWidth: 700, mx: 'auto' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <CategoryIcon sx={{ fontSize: 48, color: '#4285f4', mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                Choose your category
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Help people discover your community
              </Typography>
            </Box>

            <Grid container spacing={2} sx={{ mb: 4 }}>
              {categories.map((category) => (
                <Grid item xs={12} md={6} key={category.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: formData.category === category.id ? '2px solid #4285f4' : '1px solid #e0e0e0',
                      '&:hover': {
                        boxShadow: 3,
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => handleInputChange('category', category.id)}
                  >
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {category.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {category.description}
                      </Typography>
                      {formData.category === category.id && (
                        <CheckIcon sx={{ color: '#4285f4', float: 'right', mt: -3 }} />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Target Audience
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g., Beginner developers, Marketing professionals, Creative entrepreneurs..."
                value={formData.audience}
                onChange={(e) => handleInputChange('audience', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <SettingsIcon sx={{ fontSize: 48, color: '#4285f4', mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                Pricing & Settings
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Configure how your community works
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Pricing Model
              </Typography>
              <Grid container spacing={2}>
                {pricingOptions.map((option) => (
                  <Grid item xs={12} key={option.id}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        border: formData.pricing === option.id ? '2px solid #4285f4' : '1px solid #e0e0e0',
                        '&:hover': {
                          boxShadow: 2
                        }
                      }}
                      onClick={() => handleInputChange('pricing', option.id)}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {option.icon}
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {option.label}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {option.description}
                              </Typography>
                            </Box>
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4285f4' }}>
                            {option.price}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {formData.pricing === 'paid' && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Monthly Price
                </Typography>
                <TextField
                  fullWidth
                  placeholder="29"
                  value={formData.monthlyPrice}
                  onChange={(e) => handleInputChange('monthlyPrice', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    endAdornment: <InputAdornment position="end">/month</InputAdornment>
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Box>
            )}

            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Welcome Message
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Welcome new members with a friendly message..."
                value={formData.welcomeMessage}
                onChange={(e) => handleInputChange('welcomeMessage', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <CheckIcon sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                Review & Launch
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Everything looks good! Ready to launch your community?
              </Typography>
            </Box>

            <Paper sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#4285f4', mr: 2 }}>
                  {formData.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {formData.name || 'Your Community Name'}
                  </Typography>
                  <Chip 
                    label={categories.find(c => c.id === formData.category)?.label || 'Category'}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {formData.description || 'Your community description will appear here...'}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PeopleIcon sx={{ fontSize: 16, color: '#666' }} />
                  <Typography variant="body2" color="text.secondary">
                    0 Members
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4285f4' }}>
                  {formData.pricing === 'free' ? 'Free' : 
                   formData.pricing === 'paid' ? `$${formData.monthlyPrice || '0'}/month` : 
                   'Application Only'}
                </Typography>
              </Box>
            </Paper>

            <Box sx={{ bgcolor: '#f5f5f5', p: 3, borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                🎉 Your community will be live immediately after launch!
              </Typography>
            </Box>
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
        return formData.category && formData.audience.trim();
      case 2:
        return formData.pricing && (formData.pricing !== 'paid' || formData.monthlyPrice);
      default:
        return true;
    }
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e9ecef', py: 2 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SchoolIcon sx={{ fontSize: 32, color: '#667eea' }} />
              <Typography 
                variant="h5" 
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
                borderRadius: '25px'
              }}
            >
              Back to Discovery
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Progress Stepper */}
        <Box sx={{ mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <LinearProgress 
            variant="determinate" 
            value={(activeStep / (steps.length - 1)) * 100} 
            sx={{ mt: 2, height: 6, borderRadius: 3 }}
          />
        </Box>

        {/* Step Content */}
        <Box sx={{ mb: 4 }}>
          {getStepContent(activeStep)}
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
            sx={{ 
              px: 4, 
              py: 1.5,
              borderRadius: '25px',
              textTransform: 'none'
            }}
          >
            Back
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={() => alert('Community created successfully! 🎉')}
              sx={{ 
                px: 6, 
                py: 1.5,
                borderRadius: '25px',
                textTransform: 'none',
                background: 'linear-gradient(45deg, #4caf50, #45a049)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #45a049, #3d8b40)'
                }
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
                px: 4, 
                py: 1.5,
                borderRadius: '25px',
                textTransform: 'none',
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a67d8, #6b46c1)'
                }
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
