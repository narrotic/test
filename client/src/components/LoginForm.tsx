import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const { register, handleSubmit } = useForm<LoginFormInputs>();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string>('');

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, data);
      const token = response.data.token; 
      localStorage.setItem('token', token); 
      navigate('/home', { state: { user: response.data.user }});
    } catch (error: any) {
      console.error(error);
      setError((error.response?.data?.msg as string) || 'An error occurred');
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField {...register('email')} label="Email" type="email" fullWidth margin="normal" />
        <TextField {...register('password')} label="Password" type="password" fullWidth margin="normal" />
        <Button type="submit" variant="contained" color="primary" sx={{margin:'10px'}}>Login</Button>
      </form>
      {error && <Typography variant="body2" color="error">{error}</Typography>}
      <Typography>
      If not registered please&nbsp;
      <Button variant="outlined" component={Link} to="/signup">
        Sign Up
      </Button>
    </Typography>
    </Box>
  );
};

export default LoginForm;
