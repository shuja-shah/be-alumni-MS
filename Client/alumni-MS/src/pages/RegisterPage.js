import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button , TextField,InputAdornment, Alert, IconButton} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../components/logo';
import Iconify from '../components/iconify';
// sections
import { LoginForm } from '../sections/auth/login';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ENDPOINT } from './LoginPage';
// ----------------------------------------------------------------------



function RegisterForm() {
    const navigate = useNavigate();
    const [succ, setSucc] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        batch: '',
        country: '',
        state: '',
        city: '',
        phone_num: '',

    })
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleClick = async (e) => {

        e.preventDefault();
        if (formData.email === '' || formData.password === '') {
            setIsError(true);
            setErrorMessage('Password and Email are Required');
            return;
        } else if (formData.first_name === '') {
            setIsError(true);
            setErrorMessage('Name is Required');
            return;
        }

        const req = await fetch(`${ENDPOINT}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await req.json();
        if (!req.ok) {
            setIsError(true);
            setErrorMessage(data.error);
            return;
        }
        setSucc(true)
    };


    return (
        <>
            <Stack spacing={3}>
                <TextField name="email" label="Email address" type='email' value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />

                <TextField
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <TextField
                    name="First Name"
                    label="First Name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}

                />

                <TextField
                    name="Last Name"
                    label="Last Name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
                <TextField
                    name="Batch"
                    label="Batch"
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                />
                <TextField
                    name="Country"
                    label="Country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
                <TextField
                    name="City"
                    label="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
                <TextField
                    name="Number"
                    label="Phone Number"
                    value={formData.phone_num}
                    onChange={(e) => setFormData({ ...formData, phone_num: e.target.value })}
                />

                {isError && <Alert severity="error">{errorMessage}</Alert>}
                {succ && <Alert severity="success">Registration Successful You May Login</Alert>}
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
                <Link variant="subtitle2" underline="hover" onClick={() => navigate('/login')}>
                    Already Have an Account?
                </Link>
            </Stack>

            <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
                Register
            </LoadingButton>
        </>
    );
}

const StyledRoot = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));

const StyledSection = styled('div')(({ theme }) => ({
    width: '100%',
    maxWidth: 480,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxShadow: theme.customShadows.card,
    backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function RegisterPage() {
    const mdUp = useResponsive('up', 'md');

    return (
        <>
            <Helmet>
                <title> Register | Alumni Management System </title>
            </Helmet>

            <StyledRoot>
                <Logo
                    sx={{
                        position: 'fixed',
                        top: { xs: 16, sm: 24, md: 40 },
                        left: { xs: 16, sm: 24, md: 40 },
                    }}
                />

                {mdUp && (
                    <StyledSection>
                        <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
                            Hello, Nice to  See you
                        </Typography>
                        <img src="/assets/illustrations/illustration_login.png" alt="login" />
                    </StyledSection>
                )}

                <Container maxWidth="sm">
                    <StyledContent>
                        <Typography variant="h4" gutterBottom>
                            Sign Up for Alumni Management System
                        </Typography>

                        {/* <Typography variant="body2" sx={{ mb: 5 }}>
                            Don&apos;t have an account? {''}
                            <Link variant="subtitle2" to="/register">Get started</Link>
                        </Typography> */}

                        <RegisterForm />
                    </StyledContent>
                </Container>
            </StyledRoot>
        </>
    );
}
