import { useForm, SubmitHandler } from 'react-hook-form';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import React from 'react';

interface SignupFormInputs {
  name: string;
  email: string;
  password: string;
}

const SignupForm: React.FC = () => {
  const { register, handleSubmit } = useForm<SignupFormInputs>();
  const navigate = useNavigate()
  const [error, setError] = React.useState<string>('');

  const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/signup`, data);
      navigate('/login')
    } catch (error: any) {
      console.error(error);
      setError((error.response?.data?.msg as string) || 'An error occurred');
    }
  };

  return (
    <Box>
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField {...register('name')} label="Name" fullWidth margin="normal" />
      <TextField {...register('email')} label="Email" type="email" fullWidth margin="normal" />
      <TextField {...register('password')} label="Password" type="password" fullWidth margin="normal" />
      <Button type="submit" variant="contained" color="primary">Signup</Button>
    </form>
    {error && <Typography variant="body2" color="error">{error}</Typography>}
    <Typography>
    If already registered please&nbsp;
    <Button variant="outlined" component={Link} to="/login">
      Login
    </Button>
  </Typography>
  </Box>
  );
};

export default SignupForm;
