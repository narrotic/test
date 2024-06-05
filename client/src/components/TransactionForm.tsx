import React from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

interface TransactionData {
  recipient: string;
  amount: number;
}

const TransactionForm: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<TransactionData>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<TransactionData> = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/transaction/send`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      reset();
      navigate('/home', { state: { updateUser: true, updatedBalance: response.data.senderBalance, balanceWarning: response.data.balanceWarning } });
    } catch (error: any) {
      console.error(error);
      if (error.response) {
        alert(error.response.data.msg); // Display error message from backend
      } else {
        alert('Transaction failed. Please try again.');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h3" gutterBottom>Transaction Form</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Recipient Email"
          type="email"
          {...register('recipient')}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Amount"
          type="number"
          {...register('amount')}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">Send Transaction</Button>
      </form>
      <Button component={Link} to='/home' variant="outlined" color="primary" sx={{marginTop: '12px'}}>Back To Home</Button>
    </Container>
  );
};

export default TransactionForm;
