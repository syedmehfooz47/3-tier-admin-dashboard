import React, { useState } from 'react';
import { Box, Button, TextField, Typography, useTheme, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from 'state';
import { useLoginUserMutation } from 'state/api';

const Login = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const [loginUser, { isLoading }] = useLoginUserMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!email || !password) {
            setErrorMsg('All fields are required.');
            return;
        }

        try {
            const response = await loginUser({ email, password }).unwrap();
            dispatch(setLogin({
                user: response.user,
                token: response.token
            }));
            navigate('/dashboard');
        } catch (err) {
            setErrorMsg(err.data?.message || err.data?.error || 'Login failed. Please try again.');
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
        >
            <Box
                p="3rem"
                width="100%"
                maxWidth="450px"
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
                    Sign in to your Syed Mehfooz CS Portal
                </Typography>

                {errorMsg && (
                    <Alert severity="error" sx={{ mb: '1.5rem', textAlign: 'left' }}>
                        {errorMsg}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{
                            mb: '1.5rem',
                            '& label.Mui-focused': { color: theme.palette.secondary[300] },
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': { borderColor: theme.palette.secondary[300] }
                            }
                        }}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{
                            mb: '2rem',
                            '& label.Mui-focused': { color: theme.palette.secondary[300] },
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': { borderColor: theme.palette.secondary[300] }
                            }
                        }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={isLoading}
                        sx={{
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
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                </form>

                <Box mt="2rem">
                    <Typography 
                        variant="body2" 
                        color={theme.palette.neutral[400]}
                        onClick={() => navigate('/signup')}
                        sx={{ cursor: 'pointer', '&:hover': { color: theme.palette.secondary[300] } }}
                    >
                        Don't have an account? Sign up here.
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Login;
