// server/server.ts
import express from 'express';
import connectDB from './src/config/db';
import dotenv from 'dotenv';
// import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import bodyParser from 'body-parser';
import authRoutes from './src/routes/auth';
import transactionRoutes from './src/routes/transactions';
import cors from 'cors';

dotenv.config();

const app = express();
// Connect Database
connectDB();

// Init Middleware
app.use(bodyParser.json());
app.use(cors());

// Passport middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
    })
);

// app.use(passport.initialize());
// app.use(passport.session());

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/transaction', transactionRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
