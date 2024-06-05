import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, CircularProgress, Typography, Container } from '@mui/material';
import axios from 'axios';

interface TransactionData {
  recipient: string;
  amount: number;
  _id: string;
  sender: {
    email: string;
  };
  recipientUser: {
    email: string;
  };
  date: Date;
}

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/transaction/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTransactions(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transaction history:', error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <Container>
        <Typography variant="h4" gutterBottom>Transaction History</Typography>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ marginTop: '24px' }}>Transaction History</Typography>
      <List>
        {transactions.map(transaction => (
          <ListItem key={transaction._id}>
            <ListItemText
              primary={`Amount: $${transaction.amount} (${new Date(transaction.date).toLocaleString()})`}
              secondary={`From: ${transaction.sender.email} | To: ${transaction.recipient}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default TransactionHistory;
