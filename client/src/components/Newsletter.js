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
            Join thousands of creators making money per month with their online courses. No tech skills needed. <br /> Just bring your expertise, we'll handle the rest.
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
