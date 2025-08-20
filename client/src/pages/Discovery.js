import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Chip,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Avatar,
  Button,
  Paper
} from '@mui/material';
import {
  Search as SearchIcon,
  People as PeopleIcon,
  Star as StarIcon
} from '@mui/icons-material';

// Mock data for communities (will be replaced with API calls)
const mockCommunities = [
  {
    id: 1,
    name: "Modern Web Development",
    description: "Learn modern web development with React, Node.js, and the latest technologies! 🚀 Join thousands of developers.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop",
    members: 2400,
    price: "$29/month",
    category: "Tech",
    featured: true
  },
  {
    id: 2,
    name: "Digital Marketing Masters",
    description: "Master digital marketing strategies, SEO, social media, and grow your business online! 📈",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
    members: 1800,
    price: "Free",
    category: "Money"
  },
  {
    id: 3,
    name: "Fitness & Wellness Community",
    description: "Transform your health with our supportive fitness community. Workouts, nutrition, and motivation! 💪",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop",
    members: 3200,
    price: "$19/month",
    category: "Health"
  },
  {
    id: 4,
    name: "Creative Photography Hub",
    description: "Elevate your photography skills with tips, challenges, and a community of passionate photographers! 📸",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=200&fit=crop",
    members: 1500,
    price: "$15/month",
    category: "Hobbies"
  },
  {
    id: 5,
    name: "Mindfulness & Meditation",
    description: "Find inner peace and spiritual growth through guided meditation and mindfulness practices. 🧘‍♀️",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop",
    members: 2100,
    price: "Free",
    category: "Spirituality"
  },
  {
    id: 6,
    name: "Music Production Academy",
    description: "Create amazing music! Learn production, mixing, and collaborate with fellow music creators. 🎵",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop",
    members: 980,
    price: "$39/month",
    category: "Music"
  }
];

const categories = [
  { label: 'All', value: 'all', color: 'default' },
  { label: '🎨 Hobbies', value: 'Hobbies', color: 'warning' },
  { label: '🎵 Music', value: 'Music', color: 'secondary' },
  { label: '💰 Money', value: 'Money', color: 'success' },
  { label: '🙏 Spirituality', value: 'Spirituality', color: 'info' },
  { label: '💻 Tech', value: 'Tech', color: 'primary' },
  { label: '🏃 Health', value: 'Health', color: 'error' },
  { label: '⚽ Sports', value: 'Sports', color: 'default' },
  { label: '📚 Self-improvement', value: 'Self-improvement', color: 'default' },
  { label: '❤️ Relationships', value: 'Relationships', color: 'secondary' }
];

const Discovery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [communities, setCommunities] = useState(mockCommunities);
  const [filteredCommunities, setFilteredCommunities] = useState(mockCommunities);

  useEffect(() => {
    let filtered = communities;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(community => community.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(community =>
        community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        community.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCommunities(filtered);
  }, [searchTerm, selectedCategory, communities]);

  const formatMemberCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e9ecef', py: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4)',
                backgroundSize: '400% 400%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'gradient 3s ease infinite',
                '@keyframes gradient': {
                  '0%': { backgroundPosition: '0% 50%' },
                  '50%': { backgroundPosition: '100% 50%' },
                  '100%': { backgroundPosition: '0% 50%' }
                }
              }}
            >
              skool
            </Typography>
            <Button 
              variant="outlined" 
              sx={{ 
                textTransform: 'none',
                borderRadius: '20px',
                px: 3
              }}
            >
              LOG IN
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 'bold', 
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Discover communities
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            or{' '}
            <Typography 
              component="span" 
              sx={{ color: '#4285f4', cursor: 'pointer', textDecoration: 'underline' }}
            >
              create your own
            </Typography>
          </Typography>

          {/* Search Bar */}
          <Paper 
            elevation={1}
            sx={{ 
              maxWidth: 600, 
              mx: 'auto', 
              mb: 4,
              borderRadius: '50px',
              overflow: 'hidden'
            }}
          >
            <TextField
              fullWidth
              placeholder="Search for anything"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                disableUnderline: true,
                sx: { 
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  py: 1.5,
                  px: 2
                }
              }}
              variant="outlined"
            />
          </Paper>

          {/* Category Filters */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
            {categories.map((category) => (
              <Chip
                key={category.value}
                label={category.label}
                onClick={() => setSelectedCategory(category.value)}
                variant={selectedCategory === category.value ? 'filled' : 'outlined'}
                color={selectedCategory === category.value ? 'primary' : 'default'}
                sx={{ 
                  borderRadius: '20px',
                  px: 1,
                  '&:hover': { bgcolor: selectedCategory === category.value ? undefined : '#f5f5f5' }
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Communities Grid */}
        <Grid container spacing={3}>
          {filteredCommunities.map((community, index) => (
            <Grid item xs={12} md={4} key={community.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  },
                  position: 'relative'
                }}
              >
                {/* Ranking Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    bgcolor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    zIndex: 1
                  }}
                >
                  #{index + 1}
                </Box>

                <CardMedia
                  component="img"
                  height="160"
                  image={community.image}
                  alt={community.name}
                />
                
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        width: 24, 
                        height: 24, 
                        mr: 1,
                        bgcolor: 'primary.main',
                        fontSize: '0.75rem'
                      }}
                    >
                      {community.name.charAt(0)}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {community.name}
                    </Typography>
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mb: 3, lineHeight: 1.5 }}
                  >
                    {community.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PeopleIcon sx={{ fontSize: '1rem', mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatMemberCount(community.members)} Members
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: community.price === 'Free' ? 'success.main' : 'text.primary'
                      }}
                    >
                      {community.price}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* No Results */}
        {filteredCommunities.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No communities found matching your criteria
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your search or category filter
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Discovery;
