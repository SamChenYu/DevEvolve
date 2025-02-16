import React from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent,
  Box,
  useScrollTrigger,
  Fade,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const HeroSection = styled("div")(() => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  background: "black",
  color: "white",
  position: "relative",
  overflow: "hidden",
}));

const FeatureCard = styled(Card)(() => ({
  height: "100%",
  background: "#fff",
  marginTop: 5,
  color: "#000",
  padding: "16px",
  transition: "all 0.3s ease-in-out",
  border: "1px solid #ddd",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
    border: "1px solid #6200ea",
  }
}));

const StyledButton = styled(Button)(() => ({
  borderRadius: "24px",
  padding: "12px 24px",
  textTransform: "none",
  fontSize: "1.1rem",
  fontWeight: 500,
}));

const LandingPage = () => {
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 100 });
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Navbar */}
      <AppBar 
        position="fixed" 
        elevation={trigger ? 4 : 0}
        sx={{ 
          background: trigger ? "rgba(255, 255, 255, 0.95)" : "transparent",
          backdropFilter: trigger ? "blur(8px)" : "none",
          transition: "all 0.3s",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
          <Typography 
            variant="h5" 
            sx={{ fontWeight: 700, color: trigger ? "secondary.main" : "white" }}
          >
            DevEvolve
          </Typography>

          {/* Navigation Buttons */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button 
              variant="outlined" 
              color="secondary"
              onClick={() => navigate("/client-registration")}
            >
              Register as Client
            </Button>
            <Button 
              variant="outlined" 
              color="secondary"
              onClick={() => navigate("/developer-registration")}
            >
              Register as Developer
            </Button>
            <Button 
              variant="contained" 
              color="secondary"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="md">
          <Fade in timeout={1000}>
            <Box>
              <Typography 
                variant="h1" 
                fontWeight="800"
                sx={{ mb: 3, fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" }, letterSpacing: "-0.02em" }}
              >
                The Future of  {" "}
                
                <Box 
                  component="span" 
                  sx={{ 
                    color: "secondary.main", 
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: "-8px",
                      left: 0,
                      width: "100%",
                      height: "4px",
                      background: "currentColor",
                      borderRadius: "2px",
                      paddingLeft: "8px",
                    }
                  }}
                >
                  Freelancing
                </Box>

              </Typography>
              <Typography 
                variant="h5" 
                sx={{ mt: 4, mb: 6, color: "rgba(255,255,255,0.9)", lineHeight: 1.6 }}
              >
                A decentralised platform empowering developers & clients to collaborate seamlessly.
              </Typography>
              <Box sx={{ display: "flex", gap: 3, justifyContent: "center" }}>
                <StyledButton variant="contained" color="secondary" onClick={() => navigate("/client-registration")}>
                  Hire a Developer
                </StyledButton>
                <StyledButton 
                  variant="outlined" 
                  sx={{ borderColor: "white", color: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}
                  onClick={() => navigate("/developer-registration")}
                >
                  Start Freelancing
                </StyledButton>
              </Box>
            </Box>
          </Fade>
        </Container>
      </HeroSection>

      {/* How It Works Section */}
      <Container id="how-it-works" sx={{ py: 12 }}>
        <Typography variant="h3" align="center" gutterBottom fontWeight="700" sx={{ mb: 8 }}>
          How It Works
        </Typography>
        <Grid container spacing={8}>
          {[
            { step: "1. Clients post projects.", icon: "📢" },
            { step: "2. Developers submit bids.", icon: "💰" },
            { step: "3. Clients hire the best developer.", icon: "✔️" },
            { step: "4. Developer delivers the project.", icon: "🚀" },
            { step: "5. Client rates the project.", icon: "⭐" },
            { step: "6. Developer earns digital currency.", icon: "🏆" },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Fade in timeout={1000} style={{ transitionDelay: `${200 * index}ms` }}>
                <FeatureCard>
                  <CardContent sx={{ height: "100%", textAlign: "center" }}>
                    <Typography variant="h1" sx={{ mb: 2, fontSize: "3rem" }}>
                      {item.icon}
                    </Typography>
                    <Typography variant="h6" fontWeight="700">
                      {item.step}
                    </Typography>
                  </CardContent>
                </FeatureCard>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ bgcolor: "background.paper", py: 6, borderTop: 1, borderColor: "divider", textAlign: "center" }}
      >
        <Container>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} DevEvolve. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
