import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
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
            OUR NEWSLETTER
          </Typography>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            Stay updated with our <br/> weekly newsletter
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Why kept very ever home mrs. Considered sympathize ten 
            uncommonly occasional assistance <br/> sufficient not. Letter of on
            become he tended active enable to.
          </Typography>
        </Grid>

        {/* Right Side */}
        <Grid item size={{ xs: 12, md: 4, lg: 4 }}>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ color: "#0F3C60", fontWeight: "bold", mb: 2 }}
            >
              Signup For Newsletter
            </Typography>
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              size="small"
              sx={{ mb: 2, bgcolor: "white", borderRadius: "6px" }}
            />
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
              GET STARTED
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
