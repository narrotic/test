import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Grid } from '@mui/material';

const LandingPage: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Grid container spacing={2} justifyContent="center" alignItems="center" direction="column" style={{ minHeight: '100vh' }}>
        <Grid item>
          <Typography variant="h3" component="h1" align="center" gutterBottom>Welcome to our Website!</Typography>
          <Typography variant="body1" align="center" paragraph>Please login or signup to continue</Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" component={Link} to="/login">Login</Button>
          <Button variant="outlined" color="primary" component={Link} to="/signup" style={{ marginLeft: 16 }}>Signup</Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LandingPage;
