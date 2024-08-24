import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import './App.css';

const theme = createTheme();

export default function SignInSide() {
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = React.useState({});
  const [showErrors, setShowErrors] = React.useState(false);
  const [serverMessage, setServerMessage] = React.useState('');
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const errorMessage = searchParams.get('error');
    if (errorMessage) {
      setServerMessage(errorMessage);
      setTimeout(() => {
        setServerMessage('');
        const newUrl = window.location.pathname.split('?')[0];
        navigate(newUrl); // Navigate to root ("/")
      }, 1500); // Hide message and reset URL after 1 second
    }
  }, [location.search, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignIn = () => {
    axios.post("http://localhost:5000/signin", formData)
      .then((response) => {
        if (response.data.success) {
          if(response.data.userType === 'Job Seeker' ){
            navigate('/jobPortal');
          }else{
            navigate('/recruit');
          }
        } else {
          setServerMessage(response.data.message);
          setTimeout(() => {
            setServerMessage('');
          }, 1000); // Hide message after 1 second
        }
      })
      .catch(err => {
        setServerMessage('An error occurred. Please try again.');
        setTimeout(() => {
          setServerMessage('');
        }, 1000); // Hide message after 1 second
        console.log(err);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShowErrors(true);
      setTimeout(() => {
        setShowErrors(false);
      }, 1000); // Hide errors after 1 second
    } else {
      handleSignIn(); // Handle form submission
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          className="background-image-1"
          sx={{
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email && showErrors}
                helperText={showErrors ? errors.email : ''}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password && showErrors}
                helperText={showErrors ? errors.password : ''}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: '#4285F4', color: 'white' }}
                startIcon={<GoogleIcon />}
                onClick={() => window.location.href = 'http://localhost:5000/gsignin'}
              >
                Sign In With Google
              </Button>
              {serverMessage && <Typography color="error">{serverMessage}</Typography>}
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link to="/signup" variant="body2">
                    Don't have an account? Sign Up.
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
