import React, { useEffect } from "react";
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
  Divider,
  Avatar,
  Paper,
  Stack
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import CodeIcon from '@mui/icons-material/Code';
import BusinessIcon from '@mui/icons-material/Business';
import StarIcon from '@mui/icons-material/Star';
import SecurityIcon from '@mui/icons-material/Security';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupIcon from '@mui/icons-material/Group';
import AOS from 'aos'; // Animation on scroll library
import 'aos/dist/aos.css';


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

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 16,
  boxShadow: '0 6px 20px rgba(0,0,0,0.05)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
  }
}));

const TestimonialCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 20,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: '#fff',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.03)',
  }
}));

const LandingPage = () => {
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 100 });
  const navigate = useNavigate();
  
  // Initialize AOS animation library
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
    });
  }, []);


  const stats = [
    { value: "500+", label: "Projects Completed", icon: <CodeIcon fontSize="large" color="secondary" /> },
    { value: "300+", label: "Active Developers", icon: <GroupIcon fontSize="large" color="secondary" /> },
    { value: "98%", label: "Client Satisfaction", icon: <StarIcon fontSize="large" color="secondary" /> },
    { value: "50+", label: "New Projects Weekly", icon: <TrendingUpIcon fontSize="large" color="secondary" /> },
  ];


  const testimonials = [
    {
      quote: "DevEvolve completely changed my career trajectory. As a junior developer, I struggled to get noticed on traditional platforms. Here, I built a portfolio that landed me my dream job!",
      name: "Jordan Smith",
      role: "Web Developer",
      avatar: "JS"
    },
    {
      quote: "As a startup founder, finding affordable developers was always challenging. DevEvolve provided quality talent without breaking the bank. The digital currency system is genius.",
      name: "Michelle Torres",
      role: "Startup Founder",
      avatar: "MT"  
    },
    {
      quote: "The level-based system is incredibly fair. It gives newcomers a chance while still respecting experience. I've used both sides of the platform and had great experiences each time.",
      name: "Alex Johnson",
      role: "Full Stack Developer",
      avatar: "AJ"
    }
  ];

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <AppBar 
        position="fixed" 
        elevation={trigger ? 4 : 0}
        sx={{ 
          background: trigger ? "rgba(255, 255, 255, 0.95)" : "transparent",
          backdropFilter: trigger ? "blur(8px)" : "none",
          transition: "all 0.4s ease",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700, 
              color: trigger ? "secondary.main" : "white",
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <CodeIcon /> DevEvolve
          </Typography>

        
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button 
              variant="outlined" 
              color="secondary"
              onClick={() => navigate("/client-registration")}
              sx={{ borderRadius: '8px' }}
            >
              Register as Client
            </Button>
            <Button 
              variant="outlined" 
              color="secondary"
              onClick={() => navigate("/developer-registration")}
              sx={{ borderRadius: '8px' }}
            >
              Register as Developer
            </Button>
            <Button 
              variant="contained" 
              color="secondary"
              onClick={() => navigate("/login")}
              sx={{ borderRadius: '8px' }}
            >
              Sign In
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      
      <HeroSection>
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at bottom right, rgba(98, 0, 234, 0.15), transparent 70%)',
            zIndex: 0
          }}
        />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in timeout={2000}>
            <Box>
              <Typography 
                variant="h1" 
                fontWeight="800"
                sx={{ mb: 3, fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" }, letterSpacing: "-0.02em" }}
              >
                The Future of{" "}
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
                    }
                  }}
                >
                  Freelancing
                </Box>
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ mt: 4, mb: 3, color: "rgba(255,255,255,0.9)", lineHeight: 1.6 }}
              >
                A decentralised platform empowering developers & clients to collaborate seamlessly.
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ mb: 6, color: "rgba(255,255,255,0.7)", maxWidth: "80%", mx: "auto" }}
              >
                Break the entry barrier for new developers and provide clients with affordable solutions through our innovative digital currency system.
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


      <Container sx={{ py: 8, mt: 6, position: 'relative', zIndex: 5 }}>
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box data-aos="fade-up" data-aos-delay={index * 100}>
                <StatCard>
                  {stat.icon}
                  <Typography variant="h3" sx={{ mt: 2, fontWeight: 700 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </StatCard>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

     
      <Container sx={{ py: 10 }}>
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6} data-aos="fade-right">
            <Typography variant="overline" color="secondary.main" fontWeight={600}>
              WHAT MAKES US DIFFERENT
            </Typography>
            <Typography variant="h3" fontWeight={700} sx={{ mb: 3, mt: 1 }}>
              A Level Playing Field for All Developers
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              DevEvolve addresses the challenges in the freelance marketplace with our innovative level-based system and digital currency model. We've created a space where:
            </Typography>
            
            <Box sx={{ display: 'flex', mb: 2, alignItems: 'flex-start' }}>
              <BusinessIcon color="secondary" sx={{ mr: 2, mt: 0.5 }} />
              <Box>
                <Typography variant="h6" fontWeight={600}>Newcomers Can Thrive</Typography>
                <Typography variant="body2" color="text.secondary">
                  Our bidding system prevents experienced developers from undercutting beginners, creating fair opportunities.
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', mb: 2, alignItems: 'flex-start' }}>
              <SecurityIcon color="secondary" sx={{ mr: 2, mt: 0.5 }} />
              <Box>
                <Typography variant="h6" fontWeight={600}>Clients Take No Financial Risk</Typography>
                <Typography variant="body2" color="text.secondary">
                  Using digital currency instead of real money creates a risk-free environment to test new talent.
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <TrendingUpIcon color="secondary" sx={{ mr: 2, mt: 0.5 }} />
              <Box>
                <Typography variant="h6" fontWeight={600}>Build Real-World Portfolios</Typography>
                <Typography variant="body2" color="text.secondary">
                  Developers gain verifiable project experience and reviews they can use anywhere.
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6} data-aos="fade-left">
            <Box 
              sx={{ 
                p: 3, 
                bgcolor: 'rgba(98, 0, 234, 0.03)', 
                borderRadius: 4,
                border: '1px solid rgba(98, 0, 234, 0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
                  How Our Level System Works
                </Typography>
                
                <Grid container spacing={2}>
                  {[
                    { 
                      level: "Level 1", 
                      desc: "New developers start here with competitive minimum bids",
                      color: 'rgba(98, 0, 234, 0.1)'
                    },
                    { 
                      level: "Level 2", 
                      desc: "After earning 1000 digital currency, minimum bids increase slightly",
                      color: 'rgba(98, 0, 234, 0.25)'
                    },
                    { 
                      level: "Level 3", 
                      desc: "After earning 5000 digital currency, bringing proven experience",
                      color: 'rgba(98, 0, 234, 0.6)' 
                    },
                    { 
                      level: "Expert", 
                      desc: "Top-tier developers with highest minimum bids reflecting expertise",
                      color: '#6200ea'
                    },
                  ].map((item, i) => (
                    <Grid item xs={12} key={i}>
                      <Box 
                        sx={{ 
                          p: 2, 
                          borderRadius: 2,
                          bgcolor: item.color,
                          color: i === 3 ? 'white' : 'text.primary',
                          mb: 2
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight={600}>
                          {item.level}
                        </Typography>
                        <Typography variant="body2">
                          {item.desc}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      
      <Box sx={{ bgcolor: 'rgba(0,0,0,0.02)', py: 12 }}>
        <Container id="how-it-works">
          <Typography 
            variant="h3" 
            align="center" 
            gutterBottom 
            fontWeight="700" 
            sx={{ mb: 2 }}
            data-aos="fade-up"
          >
            How It Works
          </Typography>
          <Typography 
            variant="body1" 
            align="center" 
            color="text.secondary" 
            sx={{ mb: 8, maxWidth: '700px', mx: 'auto' }}
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Our streamlined process makes it easy for clients to find talent and for developers to build their portfolio.
          </Typography>
          
          <Grid container spacing={4}>
            {[
              { 
                step: "1. Clients post projects", 
                icon: "📢",
                description: "Clients describe their needs and set the amount of digital currency they're willing to spend."
              },
              { 
                step: "2. Developers submit bids", 
                icon: "💰",
                description: "Developers bid for projects using our level-based bidding system that ensures fair competition."
              },
              { 
                step: "3. Clients hire developers", 
                icon: "✔️",
                description: "Clients review proposals and portfolios before selecting the best fit for their project."
              },
              { 
                step: "4. Work gets delivered", 
                icon: "🚀",
                description: "Developers complete work according to specifications and timelines agreed upon."
              },
              { 
                step: "5. Client provides feedback", 
                icon: "⭐",
                description: "Clients rate the quality of work and provide detailed feedback for future improvement."
              },
              { 
                step: "6. Developers level up", 
                icon: "🏆",
                description: "Successful projects earn developers digital currency and increase their platform level."
              },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box 
                  data-aos="fade-up" 
                  data-aos-delay={index * 100}
                  data-aos-anchor-placement="top-bottom"
                >
                  <FeatureCard>
                    <CardContent sx={{ height: "260px", textAlign: "center" }}>
                      <Typography variant="h1" sx={{ mb: 2, fontSize: "3rem" }}>
                        {item.icon}
                      </Typography>
                      <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }}>
                        {item.step}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    </CardContent>
                  </FeatureCard>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      <Box 
        sx={{ 
          py: 12, 
          background: 'linear-gradient(to bottom, #000, #1a1a1a)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at top left, rgba(98, 0, 234, 0.2), transparent 70%)',
            zIndex: 0
          }}
        />
        <Container sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h3" 
            align="center" 
            gutterBottom 
            fontWeight="700" 
            color="white"
            data-aos="fade-up"
          >
            Success Stories
          </Typography>
          <Typography 
            variant="body1" 
            align="center" 
            sx={{ mb: 8, color: 'rgba(255,255,255,0.7)', maxWidth: '700px', mx: 'auto' }}
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Hear from developers and clients who have transformed their careers and businesses with DevEvolve.
          </Typography>
          
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box 
                  data-aos="fade-up" 
                  data-aos-delay={index * 150}
                >
                  <TestimonialCard sx={{ height: '350px' }}>
                    <Typography variant="body1" sx={{ mb: 4, fontStyle: 'italic' }}>
                      "{testimonial.quote}"
                    </Typography>
                    <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>{testimonial.avatar}</Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                  </TestimonialCard>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>


      <Container sx={{ py: 12 }}>
        <Box 
          sx={{ 
            textAlign: 'center', 
            maxWidth: '800px', 
            mx: 'auto',
            px: 4,
            py: 8,
            borderRadius: 4,
            background: 'rgba(98, 0, 234, 0.03)',
            border: '1px solid rgba(98, 0, 234, 0.1)',
          }}
          data-aos="fade-up"
        >
          <Typography variant="h3" fontWeight={700} sx={{ mb: 3 }}>
            Ready to Get Started?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
            Whether you're a client looking for affordable development or a developer building your portfolio, DevEvolve provides the platform you need to succeed.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <StyledButton 
              variant="contained" 
              color="secondary" 
              size="large"
              onClick={() => navigate("/client-registration")}
            >
              Join as a Client
            </StyledButton>
            <StyledButton 
              variant="outlined" 
              color="secondary"
              size="large"
              onClick={() => navigate("/developer-registration")}
            >
              Join as a Developer
            </StyledButton>
          </Stack>
        </Box>
      </Container>

      <Box 
        component="footer" 
        sx={{ bgcolor: "background.paper", py: 6, borderTop: 1, borderColor: "divider" }}
      >
          
          <Box sx={{ display: 'flex', padding: 2, justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} DevEvolve. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {['Terms of Service', 'Privacy Policy', 'Cookie Policy'].map(item => (
                <Button 
                  key={item} 
                  variant="text" 
                  color="inherit"
                  sx={{ color: 'text.secondary', fontSize: '0.75rem' }}
                >
                  {item}
                </Button>
              ))}
            </Box>
          </Box>

      </Box>
    </Box>
  );
};

export default LandingPage;