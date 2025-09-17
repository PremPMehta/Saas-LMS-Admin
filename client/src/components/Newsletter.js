import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Container
} from "@mui/material";

export default function Newsletter() {
  const stats = [
    { value: "15,000+", label: "Creators" },
    { value: "$50M+", label: "Earned" },
    { value: "98%", label: "Success Rate" },
  ];
  return (
    <Box
      sx={{
        bgcolor: "#0f3b6009",
        p: 4,
        borderRadius: "12px",
          
        mx: "auto",
        mt: 5, 
      }}
    >
      <Grid container spacing={4} alignItems="center">
        {/* Left Side */}
        <Grid item size={{ xs: 12, md: 8, lg: 8 }}>
          <Typography
            variant="subtitle2"
            sx={{ color: "#0F3C60", fontWeight: "bold", mb: 1 }}
          >
            Bell N Desk
          </Typography>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            Turn Your Knowledge Into <br/> Recurring Revenue
          </Typography>
          <Typography
            variant="h6"
            sx={{mb: 2 }}
          >
            Build. Teach. Earn. Repeat.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Join thousands of creators making $10k+ per month with their online courses. No tech skills needed. <br /> Just bring your expertise, we'll handle the rest.
          </Typography>
        </Grid>

        {/* Right Side */}
        <Grid item size={{ xs: 12, md: 4, lg: 4 }}>
          <Box>
            {/* <Typography
              variant="subtitle1"
              sx={{ color: "#0F3C60", fontWeight: "bold", mb: 2 }}
            >
              Signup For Newsletter
            </Typography> */}
            {/* <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              size="small"
              sx={{ mb: 2, bgcolor: "white", borderRadius: "6px" }}
            /> */}
            {/* <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type="password"
              size="small"
              sx={{ mb: 2, bgcolor: "white", borderRadius: "6px" }}
            /> */}
            <Box
                sx={{
                  color: "#0F3C60",
                  textAlign: "center",
                  mb: 3,
                }}
              >
                <Grid container spacing={4} justifyContent="center">
                  {stats.map((item, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                      <Box sx={{ display: "flex" , flexDirection: "column", alignItems: "center" , borderRight: 2, borderColor: 'divider', pr:2, lastChild: { borderRight: 'none !important' } }}>
                        <Typography
                          variant="h5"
                          component="div"
                          sx={{ fontWeight: "bold" }}
                        >
                          {item.value}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ opacity: 0.85 }}>
                          {item.label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            <Button
              variant="contained"
              fullWidth
              sx={{
                bgcolor: "#0F3C60",
                "&:hover": { bgcolor: "#0F3C60" },
              
                py: 1,
              }}
            >
              🚀 Start Free Trial
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
