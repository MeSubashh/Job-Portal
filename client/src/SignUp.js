import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import './App.css'; // Import your CSS file with defined classes
import axios from 'axios';

const theme = createTheme();

export default function SignUp() {
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    userType: 'Job Seeker'
  });
  const [errors, setErrors] = React.useState({});
  const [showErrors, setShowErrors] = React.useState(false);
  const [serverMessage, setServerMessage] = React.useState('');
  const navigate = useNavigate();

  const handleSignUp = () => {
    axios.post("http://localhost:5000/signup", { data: formData })
      .then((response) => {
        if (response.data.message === 'User created successfully') {
          setServerMessage(response.data.message);
          setTimeout(() => {
            navigate('/'); // Redirect to sign-in page after 2 seconds
          }, 1000);
        } else {
          setServerMessage(response.data.message);
        }
      })
      .catch(err => {
        setServerMessage('An error occurred. Please try again.');
        console.log(err);
      });
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First Name is required';
    if (!formData.lastName) newErrors.lastName = 'Last Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShowErrors(true);
      setTimeout(() => {
        setShowErrors(false);
      }, 1000); // Hide errors after 3 seconds
    } else {
      handleSignUp(); // Handle form submission
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
          className="background-image-2" // Apply your CSS class here
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
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="fname"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    value={formData.firstName}
                    onChange={handleChange}
                    error={!!errors.firstName && showErrors}
                    helperText={showErrors ? errors.firstName : ''}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="lname"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={!!errors.lastName && showErrors}
                    helperText={showErrors ? errors.lastName : ''}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email && showErrors}
                    helperText={showErrors ? errors.email : ''}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password && showErrors}
                    helperText={showErrors ? errors.password : ''}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset" required>
                    <FormLabel component="legend">I am a</FormLabel>
                    <RadioGroup
                      row
                      name="userType"
                      value={formData.userType}
                      onChange={handleChange}
                    >
                      <FormControlLabel value="Job Seeker" control={<Radio />} label="Job Seeker" />
                      <FormControlLabel value="Job Recruiter" control={<Radio />} label="Job Recruiter" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
              {serverMessage && <Typography color="error">{serverMessage}</Typography>}

              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Sign Up
              </Button>
              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: '#4285F4', color: 'white' }}
                startIcon={<GoogleIcon />}
                onClick={() => {
                  const userType = formData.userType; // Retrieve userType from state
                  window.location.href = `http://localhost:5000/gsignup?userType=${userType}`;
                }}
              >
                Sign Up With Google
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link to="/" variant="body2">
                    Already have an account? Sign in
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
