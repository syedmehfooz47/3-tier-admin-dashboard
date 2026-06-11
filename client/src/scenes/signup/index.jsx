import React, { useState } from 'react';
import { Box, Button, TextField, Typography, useTheme, Alert, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useRegisterUserMutation } from 'state/api';

const Signup = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [formState, setFormState] = useState({
        name: '',
        email: '',
        password: '',
        occupation: '',
        phoneNumber: '',
        city: '',
        state: '',
        country: ''
    });

    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const [registerUser, { isLoading }] = useRegisterUserMutation();

    const handleChange = (e) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        const { name, email, password } = formState;
        if (!name || !email || !password) {
            setErrorMsg('Name, email, and password are required.');
            return;
        }

        try {
            await registerUser(formState).unwrap();
            setSuccessMsg('Account registered successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setErrorMsg(err.data?.error || err.data?.message || 'Registration failed. Try again.');
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            backgroundColor={theme.palette.background.default}
            p="2rem"
        >
            <Box
                p="3rem"
                width="100%"
                maxWidth="600px"
                borderRadius="1.5rem"
                backgroundColor={theme.palette.background.alt}
                textAlign="center"
                boxShadow="0px 10px 30px rgba(0, 0, 0, 0.2)"
            >
                <Typography 
                    variant="h2" 
                    fontWeight="bold" 
                    mb="1rem" 
                    color={theme.palette.secondary.main}
                >
                    ECOMVISION
                </Typography>
                <Typography variant="h5" mb="2rem" color={theme.palette.neutral[300]}>
                    Create your Syed Mehfooz CS Administrator Account
                </Typography>

                {errorMsg && (
                    <Alert severity="error" sx={{ mb: '1.5rem', textAlign: 'left' }}>
                        {errorMsg}
                    </Alert>
                )}

                {successMsg && (
                    <Alert severity="success" sx={{ mb: '1.5rem', textAlign: 'left' }}>
                        {successMsg}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Full Name *"
                                name="name"
                                fullWidth
                                variant="outlined"
                                value={formState.name}
                                onChange={handleChange}
                                sx={{ '& label.Mui-focused': { color: theme.palette.secondary[300] }, '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: theme.palette.secondary[300] } } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Email Address *"
                                name="email"
                                type="email"
                                fullWidth
                                variant="outlined"
                                value={formState.email}
                                onChange={handleChange}
                                sx={{ '& label.Mui-focused': { color: theme.palette.secondary[300] }, '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: theme.palette.secondary[300] } } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Password *"
                                name="password"
                                type="password"
                                fullWidth
                                variant="outlined"
                                value={formState.password}
                                onChange={handleChange}
                                sx={{ '& label.Mui-focused': { color: theme.palette.secondary[300] }, '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: theme.palette.secondary[300] } } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Occupation"
                                name="occupation"
                                fullWidth
                                variant="outlined"
                                value={formState.occupation}
                                onChange={handleChange}
                                sx={{ '& label.Mui-focused': { color: theme.palette.secondary[300] }, '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: theme.palette.secondary[300] } } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Phone Number"
                                name="phoneNumber"
                                fullWidth
                                variant="outlined"
                                value={formState.phoneNumber}
                                onChange={handleChange}
                                sx={{ '& label.Mui-focused': { color: theme.palette.secondary[300] }, '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: theme.palette.secondary[300] } } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="City"
                                name="city"
                                fullWidth
                                variant="outlined"
                                value={formState.city}
                                onChange={handleChange}
                                sx={{ '& label.Mui-focused': { color: theme.palette.secondary[300] }, '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: theme.palette.secondary[300] } } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="State"
                                name="state"
                                fullWidth
                                variant="outlined"
                                value={formState.state}
                                onChange={handleChange}
                                sx={{ '& label.Mui-focused': { color: theme.palette.secondary[300] }, '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: theme.palette.secondary[300] } } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Country (e.g. US, IN, ID)"
                                name="country"
                                fullWidth
                                variant="outlined"
                                value={formState.country}
                                onChange={handleChange}
                                sx={{ '& label.Mui-focused': { color: theme.palette.secondary[300] }, '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: theme.palette.secondary[300] } } }}
                            />
                        </Grid>
                    </Grid>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={isLoading}
                        sx={{
                            mt: '2rem',
                            backgroundColor: theme.palette.secondary[400],
                            color: theme.palette.background.alt,
                            fontSize: '14px',
                            fontWeight: 'bold',
                            padding: '12px',
                            borderRadius: '8px',
                            '&:hover': {
                                backgroundColor: theme.palette.secondary[300],
                                color: theme.palette.background.default
                            }
                        }}
                    >
                        {isLoading ? 'Signing Up...' : 'Sign Up'}
                    </Button>
                </form>

                <Box mt="2rem">
                    <Typography 
                        variant="body2" 
                        color={theme.palette.neutral[400]}
                        onClick={() => navigate('/login')}
                        sx={{ cursor: 'pointer', '&:hover': { color: theme.palette.secondary[300] } }}
                    >
                        Already have an account? Sign in here.
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Signup;
