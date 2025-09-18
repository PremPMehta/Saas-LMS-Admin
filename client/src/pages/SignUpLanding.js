import React, { useState } from "react";
import { Box, Button, Container, Typography, Modal, TextField, Link } from "@mui/material";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { EffectCards } from 'swiper/modules';
import logo from "../assets/logo.png";
import { Pagination, Navigation } from 'swiper/modules';
import slider1 from '../assets/Sesiones-en-Vivo.jpg';
import slider2 from '../assets/Real-World-Assets.jpg';
import slider3 from '../assets/Podcast.jpg';
import slider4 from '../assets/Avanzado.jpg';
import slider5 from '../assets/Desarrollador-Web3.jpg';
import slider6 from '../assets/Legal-Tech.jpg';
import googleLogo from '../assets/google-logo.png';


const sliderData = [
    {
        title: "Learn Modern Calligraphy",
        subtitle: "Calligraphy School",
        income: "$6,237/month",
        img: slider1,
        people: ["Jordan", "Jillian"]
    },
    {
        title: "Cyber Security Course",
        subtitle: "Cyber School",
        income: "$8,450/month",
        img: slider2,
        people: ["Alex", "Chris"]
    },
    {
        title: "Fitness Community",
        subtitle: "Health School",
        income: "$5,200/month",
        img: slider3,
        people: ["Sam", "Taylor"]
    },
    {
        title: "Fitness Community",
        subtitle: "Health School",
        income: "$5,200/month",
        img: slider4,
        people: ["Sam", "Taylor"]
    },
    {
        title: "Fitness Community",
        subtitle: "Health School",
        income: "$5,200/month",
        img: slider5,
        people: ["Sam", "Taylor"]
    },
    {
        title: "Fitness Community",
        subtitle: "Health School",
        income: "$5,200/month",
        img: slider6,
        people: ["Sam", "Taylor"]
    }
];

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

const SignUpLanding = () => {
    // Modal state
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Modal view state
    const [modalView, setModalView] = useState("signup"); // "signup" or "login"

    // Form state
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Reset form and modal view when opening modal
    const openSignup = () => {
        setModalView("signup");
        setForm({ firstName: "", lastName: "", email: "", password: "" });
        handleOpen();
    };
    const openLogin = () => {
        setModalView("login");
        setForm({ email: "", password: "" });
        handleOpen();
    };

    return (
        <Container maxWidth="md" sx={{ textAlign: "center", mt: 8, mb: 8 }}>
            {/* Logo */}
            <Box className="signup_logo" >
                <img src={logo} alt="Logo" style={{ marginBottom: 20 }} />
            </Box>

            {/* Subtitle */}
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0 }}>
                Join a movement of <b >172k passionate people</b> earning{" "} <br />
                <b>$1+ billion per year</b> building communities
            </Typography>

            {/* Slider */}
            <Box sx={{ maxWidth: 700, mx: "auto", mb: 5 }}>
                <Swiper
                    effect={'cards'}
                    grabCursor={false}
                    modules={[EffectCards, Pagination, Navigation]}
                    navigation={true}
                    autoplay={{
                        delay: 1000,
                    }}
                    className="signup_cards_swiper">
                    {sliderData.map((item, index) => (
                        <SwiperSlide>
                            <Box
                                key={index}
                                className="signup_card"
                            >
                                <Box className="card_content" sx={{ position: "relative" }}>
                                    <Box className="card_image">
                                        <img
                                            src={item.img}
                                            alt={item.title}
                                            style={{ width: "100%", height: "auto" }}
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: 10,
                                            right: 10,
                                            bgcolor: "green",
                                            color: "#fff",
                                            px: 2,
                                            py: 0.5,
                                            borderRadius: 2,
                                            fontSize: 12,
                                            fontWeight: 600,
                                        }}
                                    >
                                        {item.subtitle} <br /> Earns {item.income}
                                    </Box>
                                </Box>
                            </Box>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box>


            {/* CTA Button */}
            <Button
                variant="contained"
                size="large"
                color="primary"
                onClick={openSignup}
            >
                CREATE YOUR COMMUNITY
            </Button>

            {/* Modal */}
            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        width: '200px',
                        margin: '0 auto'
                    }}>
                        <img src={logo} alt="Logo" style={{ marginBottom: 20, width: '100%' }} />
                    </Box>
                    {modalView === "signup" ? (
                        <>
                            <Typography
                                variant="h6"
                                component="h2"
                                align="center"
                                fontWeight="bold"
                            >
                                Create your Bell n Desk account
                            </Typography>
                            <Box mt={2} display="flex" flexDirection="column" gap={2}>
                                <TextField
                                    label="First name"
                                    name="firstName"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    fullWidth
                                />
                                <TextField
                                    label="Last name"
                                    name="lastName"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    fullWidth
                                />
                                <TextField
                                    label="Email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    fullWidth
                                />
                                <TextField
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    fullWidth
                                />
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{ mt: 1 }}
                                >
                                    Sign Up
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    fullWidth
                                    sx={{
                                        py: '8px',
                                        fontSize: '14px',
                                        textTransform: 'none',
                                        borderRadius: '12px',
                                        borderColor: '#dadce0',
                                        color: '#3c4043',
                                        backgroundColor: '#fff',
                                        '&:hover': {
                                            backgroundColor: '#f8f9fa',
                                            borderColor: '#dadce0',
                                        },
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                    }}
                                    startIcon={
                                        <Box
                                            component="img"
                                            src={googleLogo}
                                            alt="Google"
                                            sx={{ width: 20, height: 20 }}
                                        />
                                    }
                                >
                                    Sign Up with Google
                                </Button>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    align="center"
                                >
                                    By signing up, you accept our{" "}
                                    <Link href="#">terms</Link> and{" "}
                                    <Link href="#">privacy policy</Link>.
                                </Typography>
                                <Typography variant="body2" align="center" sx={{ mt: 1 }} >
                                    Already have an account?{" "}
                                    <Link href="#" onClick={() => { setModalView("login"); setForm({ email: "", password: "" }); }}>Sign In</Link>
                                </Typography>
                            </Box>
                        </>
                    ) : (
                        <>
                            <Typography
                                variant="h6"
                                component="h2"
                                align="center"
                                fontWeight="bold"
                            >
                                Sign In to Bell n Desk
                            </Typography>
                            <Box mt={2} display="flex" flexDirection="column" gap={2}>
                                <TextField
                                    label="Email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    fullWidth
                                />
                                <TextField
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    fullWidth
                                />
                                <Link href="#" underline="hover" sx={{ mb: 1, alignSelf: 'flex-end' }}>
                                    Forgot password?
                                </Link>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{ mt: 1 }}
                                >
                                    Sign In
                                </Button>
                                <Typography
                                    variant="body2"
                                    align="center"
                                    sx={{ mt: 1 }}
                                >
                                    Don't have an account?{" "}
                                    <Link href="#" onClick={() => { setModalView("signup"); setForm({ firstName: "", lastName: "", email: "", password: "" }); }}>
                                        Sign up for free
                                    </Link>
                                </Typography>
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
        </Container>
    );
};

export default SignUpLanding;
