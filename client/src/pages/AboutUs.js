import React, { useState } from 'react';

// --- Swiper Imports ---
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
// --- End Swiper Imports ---

import {
    createTheme,
    ThemeProvider,
    responsiveFontSizes,
    Box,
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    Button,
    Stack,
    Avatar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Alert,
    CardMedia,
    CardHeader,
    ListItemAvatar
} from '@mui/material';
import {
    Lock,
    Group,
    Paid,
    CheckCircle,
    Instagram,
    Telegram
} from '@mui/icons-material';
import { CSS } from '@dnd-kit/utilities';
// Define and configure the theme
let theme = createTheme({
    palette: {
        primary: {
            main: '#0F3C60',
        },
        background: {
            default: '#f4f6f8',
        },
    },
    typography: {
        fontFamily: `'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'Helvetica', sans-serif`,
    },
});

theme = responsiveFontSizes(theme);

// Data for the slider
const sliderData = [
    {
        type: 'video',
        src: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumb: 'https://picsum.photos/id/2/200/300',
    },
    {
        type: 'image',
        src: 'https://picsum.photos/id/3/200/300',
        thumb: 'https://picsum.photos/id/3/200/300',
    },
    {
        type: 'image',
        src: 'https://picsum.photos/id/4/200/300',
        thumb: 'https://picsum.photos/id/4/200/300',
    },
    {
        type: 'image',
        src: 'https://picsum.photos/id/5/200/300',
        thumb: 'https://picsum.photos/id/5/200/300',
    },
    {
        type: 'image',
        src: 'https://picsum.photos/id/6/200/300',
        thumb: 'https://picsum.photos/id/6/200/300',
    },
];


// THE FULL "ABOUT US" PAGE COMPONENT
const AboutUs = () => {
    // State to link the main slider with the thumbnail slider
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    const features = [
        'Premium courses on Web3, Blockchain, DAOs, Legal Tech, AI, RWA, and more',
        'On-chain certification to validate your industry knowledge',
        'Live classes with experts and moderators from the top crypto world',
        'Weekly reports: real-time Web3 analysis, trends, and opportunities',
        'Active community on Skool and Telegram to collaborate, ask questions, and grow',
        'Immediate access to tools, infographics, and resources applicable from day 1',
        'A structured roadmap to help you go from scratch to offering your services in the Web3 ecosystem',
    ];

    // Helper component for info items
    const InfoItem = ({ icon, text }) => (
        <Stack direction="row" alignItems="center" spacing={0.5}>
            {icon} <Typography variant="body2">{text}</Typography>
        </Stack>
    );

    // Helper component for stats
    const Stat = ({ value, label }) => (
        <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{value}</Typography>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
        </Box>
    );

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ bgcolor: 'background.default', py: { xs: 3, md: 5 } }}>
                <Container maxWidth="lg">
                    <Grid container spacing={{ xs: 3, md: 4 }}>
                        <Grid item size={{ xs: 12, md: 8 }} >
                            <Card sx={{ boxShadow: '0 0 21px 0 rgba(89, 102, 122, 0.1)' , borderRadius: '15px' }}>
                                <CardHeader title="Cryptomanji" sx={{pb: 0}} />
                                <CardContent>
                                    <Box sx={{
                                        '.swiper-button-next, .swiper-button-prev': { color: '#fff' },
                                        '.swiper-pagination-bullet-active': { backgroundColor: '#fff' },
                                    }}>

                                        <Swiper
                                            modules={[Navigation, Pagination, Thumbs]}
                                            spaceBetween={10}
                                            navigation
                                            pagination={{ clickable: true }}
                                            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                            style={{ borderRadius: '8px', marginBottom: '8px' }}
                                            className='swiper_slide_custom'
                                        >
                                            {sliderData.map((item, index) => (
                                                <SwiperSlide key={index} >
                                                    {item.type === 'video' ? (
                                                        <video src={item.src} controls style={{ width: '100%', height: '100%', display: 'flex' }} />
                                                    ) : (
                                                        <img src={item.src} alt={`Slide ${index + 1}`} style={{ width: '100%', height: 'auto', display: 'block' }} />
                                                    )}
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>

                                        <Swiper
                                            onSwiper={setThumbsSwiper}
                                            spaceBetween={10}
                                            slidesPerView={5}
                                            watchSlidesProgress
                                            modules={[Thumbs]}
                                            className='swiper_slide_custom_bottom'
                                            style={{ '--swiper-navigation-color': '#fff', '--swiper-pagination-color': '#fff' }}
                                        >
                                            {sliderData.map((item, index) => (
                                                <SwiperSlide key={index} style={{ cursor: 'pointer' }}>
                                                    <img
                                                        src={item.thumb}
                                                        alt={`Thumbnail ${index + 1}`}
                                                        style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px', opacity: 0.6 }}
                                                    />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </Box>

                                    {/* --- End Swiper Slider --- */}
                                    {/* Info Bar */}
                                    <Stack
                                        direction="row" spacing={{ xs: 2, md: 3 }} alignItems="center"
                                        sx={{ borderBottom: '1px solid #e0e0e0', pb: 2, flexWrap: 'wrap', rowGap: 1, mt: 3 }}
                                    >
                                        <InfoItem icon={<Lock fontSize="small" />} text="Private" />
                                        <InfoItem icon={<Group fontSize="small" />} text="941 members" />
                                        <InfoItem icon={<Paid fontSize="small" />} text="Paid" />
                                        <InfoItem
                                            icon={<Avatar sx={{ width: 24, height: 24, mr: 0.5 }} src="https://picsum.photos/id/3/200/300" />}
                                            text="By Crypto Manji"
                                        />
                                    </Stack>
                                    <Button variant="contained" size="large" fullWidth color='primary' sx={{ display: { xs: 'block', md: 'none' }, my: 2 }}>
                                        Join Group
                                    </Button>
                                    {/* Welcome Section */}
                                    <Box>
                                        <Box sx={{ mt: 3 }}>
                                            <Typography variant="h5" gutterBottom>Welcome to Cryptomanji</Typography>
                                        </Box>
                                        <Typography variant="body1" color="text.secondary">
                                            The Hispanic community is moving away from crowded careers...and starting to thrive with skills for the future.
                                        </Typography>
                                    </Box>
                                    {/* Features Section */}
                                    <Box sx={{ my: 3 }}>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }} color="text.secondary">
                                            What you unlock for just $27/month (valued at over $2,000)
                                        </Typography>
                                        <List sx={{ p: 0 }}>
                                            {features.map((text, index) => (
                                                <ListItem key={index} disableGutters sx={{ py: 0 }} color="text.secondary">
                                                    <ListItemIcon sx={{ minWidth: 32 }}><CheckCircle color="success" /></ListItemIcon>
                                                    <ListItemText primary={text} color="text.secondary" />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Box>

                                    <Typography variant="body1" color="text.secondary">All courses are flexible, recorded, and without filler</Typography>
                                    <Typography variant="body1" color="text.secondary"> Bonus: Weekly Trade Ideas and Real-World Examples</Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 'bold', my: 3 }}>All this, for only $27 a month.</Typography>

                                    <Alert severity="warning" icon={false} sx={{ bgcolor: '#fff8e1' }}>
                                        A price increases to $47 per month with 1,000 members.
                                    </Alert>

                                    <Typography variant="body1" sx={{ my: 3 }}>Certification, community, and vision for the future.</Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* ============== Right Column: Sidebar ============== */}
                        <Grid item size={{ xs: 12, md: 4 }} sx={{
                            display: { xs: 'none', md: 'block' }

                        }} >
                            <Card sx={{ boxShadow: '0 0 21px 0 rgba(89, 102, 122, 0.1)' , borderRadius: '15px' }}>
                                <CardMedia component="img" height="140" image="https://picsum.photos/id/3/200/300" alt="Crypto Manji Banner" />
                                <CardContent sx={{ textAlign: 'left' }}>
                                    <Typography variant="h5" component="div">Cryptomanji</Typography>
                                    <Typography sx={{ mb: 2 }} color="text.secondary">@cryptomanji</Typography>
                                    <Typography variant="body2" sx={{ mb: 2 }}>
                                        Cryptocurrency community designed for those looking to learn, grow, and thrive in the exciting world of digital asset investing.
                                    </Typography>

                                    <Stack spacing={1} sx={{ mb: 3 }}>
                                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                            <ListItem sx={{ px: 0 }}>
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <Instagram />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary="Instagram" />
                                            </ListItem>
                                            <ListItem sx={{ px: 0 }}>
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <Telegram />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary="Telegram" />
                                            </ListItem>
                                        </List>
                                    </Stack>

                                    <Stack direction="row" justifyContent="space-around" sx={{ mb: 3 }}>
                                        <Box className="card_details_group">
                                            <Stat value="941" label="Members" />
                                        </Box>
                                        <Box className="card_details_group">
                                            <Stat value="1" label="On-line" />
                                        </Box>
                                        <Box className="card_details_group">
                                            <Stat value="5" label="Admins" />
                                        </Box>
                                    </Stack>

                                    <Button variant="contained" size="large" fullWidth color='primary' >
                                        Join Group
                                    </Button>
                                </CardContent>
                                <Typography variant="caption" display="block" color="text.secondary" textAlign="center" sx={{ pb: 2 }}>
                                    Powered by <strong>Bell n Desk</strong>
                                </Typography>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default AboutUs;