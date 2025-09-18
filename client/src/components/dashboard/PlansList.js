import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Check as CheckIcon,
  Star as StarIcon,
  LocalFireDepartment as PopularIcon,
} from '@mui/icons-material';

const PlansList = ({ plans }) => {
  const getPlanColor = (planName) => {
    switch (planName.toLowerCase()) {
      case 'premium':
        return 'primary';
      case 'standard':
        return 'secondary';
      case 'basic':
        return 'default';
      default:
        return 'default';
    }
  };

  const getPlanIcon = (planName) => {
    switch (planName.toLowerCase()) {
      case 'premium':
        return <StarIcon sx={{ color: 'primary.main' }} />;
      case 'standard':
        return <StarIcon sx={{ color: 'secondary.main' }} />;
      case 'basic':
        return <StarIcon sx={{ color: 'text.secondary' }} />;
      default:
        return null;
    }
  };

  const getPlanGradient = (planName) => {
    switch (planName.toLowerCase()) {
      case 'premium':
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'standard':
        return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
      case 'basic':
        return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
      default:
        return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
    }
  };

  if (!plans || plans.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <StarIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
          No plans found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Create subscription plans to get started
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {plans.map((plan, index) => (
        <Card
          key={plan.id}
          sx={{
            border: '1px solid',
            borderColor: plan.popular ? 'primary.main' : 'divider',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: plan.popular ? getPlanGradient(plan.name) : 'transparent',
              transform: 'scaleX(0)',
              transition: 'transform 0.3s ease-in-out',
            },
            '&:hover': {
              borderColor: 'primary.main',
              boxShadow: plan.popular 
                ? '0 12px 40px rgba(25, 118, 210, 0.15)' 
                : '0 8px 32px rgba(0, 0, 0, 0.1)',
              transform: 'translateY(-4px)',
              '&::before': {
                transform: 'scaleX(1)',
              },
              '& .plan-icon': {
                transform: 'scale(1.1) rotate(5deg)',
              },
            },
          }}
        >
          {plan.popular && (
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                zIndex: 1,
              }}
            >
              <Chip
                icon={<PopularIcon />}
                label="Most Popular"
                size="small"
                color="primary"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 24,
                  background: getPlanGradient(plan.name),
                  color: 'white',
                  '& .MuiChip-icon': {
                    color: 'white',
                    fontSize: '1rem',
                  },
                }}
              />
            </Box>
          )}
          
          <CardContent sx={{ p: 3, pt: plan.popular ? 4 : 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  className="plan-icon"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: plan.popular 
                      ? getPlanGradient(plan.name) 
                      : 'rgba(25, 118, 210, 0.1)',
                    transition: 'transform 0.3s ease-in-out',
                  }}
                >
                  {getPlanIcon(plan.name)}
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {plan.name}
                  </Typography>
                  <Chip
                    label={plan.limits}
                    size="small"
                    color={getPlanColor(plan.name)}
                    variant="outlined"
                    sx={{ 
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      height: 24,
                      borderWidth: 2,
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 800,
                    background: plan.popular 
                      ? getPlanGradient(plan.name) 
                      : 'linear-gradient(45deg, #0F3C60, #42a5f5)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 0.5,
                  }}
                >
                  {plan.price}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  per {plan.period}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2.5, opacity: 0.6 }} />

            <List dense sx={{ py: 0 }}>
              {plan.features.map((feature, featureIndex) => (
                <ListItem key={featureIndex} sx={{ px: 0, py: 0.75 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #4CAF50, #66BB6A)',
                        color: 'white',
                      }}
                    >
                      <CheckIcon sx={{ fontSize: 14 }} />
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={feature}
                    primaryTypographyProps={{
                      variant: 'body2',
                      sx: { 
                        fontWeight: 500,
                        color: 'text.primary',
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default PlansList; 