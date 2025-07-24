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

  if (!plans || plans.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          No plans found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {plans.map((plan, index) => (
        <Card
          key={plan.id}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              borderColor: 'primary.main',
              boxShadow: 2,
            },
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getPlanIcon(plan.name)}
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {plan.name}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {plan.price}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  per {plan.period}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Chip
                label={plan.limits}
                size="small"
                color={getPlanColor(plan.name)}
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
            </Box>

            <Divider sx={{ my: 1.5 }} />

            <List dense sx={{ py: 0 }}>
              {plan.features.map((feature, featureIndex) => (
                <ListItem key={featureIndex} sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <CheckIcon fontSize="small" color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary={feature}
                    primaryTypographyProps={{
                      variant: 'body2',
                      sx: { fontWeight: 500 },
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