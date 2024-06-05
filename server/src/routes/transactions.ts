// server/routes/transactions.ts
import express, { NextFunction, Request, Response } from 'express';
import Transaction from '../models/Transaction';
import User from '../models/User';
import jwt from 'jsonwebtoken'; // Import JWT library
import dotenv from 'dotenv';

const router = express.Router();

dotenv.config();

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

  try {
      if (!token) {
          return res.status(401).json({ msg: 'Token not provided' });
      }

      if (!process.env.JWT_SECRET) {
          throw new Error('JWT secret not found in environment variables');
      }

      // Verify token and extract user ID
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
      // req.userId = decoded.userId; // Attach user ID to request object
      next();
  } catch (error) {
      console.error(error);
      res.status(401).json({ msg: 'Token invalid or expired' });
  }
};

router.post('/send', verifyToken, async (req: Request, res: Response) => {
  const { recipient, amount } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  try {
    if (!token) {
      return res.status(401).json({ msg: 'Token not provided' });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT secret not found in environment variables');
    }

    // Verify token and extract user ID
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
    const senderId = decoded.userId;

    // Retrieve sender by their ID
    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ msg: 'Sender not found' });
    }

    if (!recipient) {
      return res.status(400).json({ msg: 'Recipient email not provided' });
    }

    if (sender.email === recipient) {
      return res.status(400).json({ msg: "Cannot send transaction to self" });
    }

    // Find recipient by their email
    const recipientUser = await User.findOne({ email: recipient });
    if (!recipientUser) {
      return res.status(404).json({ msg: 'Recipient not found' });
    }

    if (sender.balance < amount) {
      return res.status(400).json({ msg: `Insufficient balance. Your current balance is ${sender.balance}` });
    }

    // Update sender balance
    sender.balance -= amount;
    await sender.save();

    // Update recipient balance
    recipientUser.balance = (recipientUser.balance + parseFloat(amount)); // Ensure numerical addition
    await recipientUser.save();

    // Save the transaction after successful balance updates
    const newTransaction = new Transaction({
      sender: senderId,
      recipient,
      amount,
    });
    await newTransaction.save();

    // Redirect back to the home page with updated balances
    if(sender.balance < 15) {
      res.status(201).json({ msg: 'Transaction sent successfully', senderBalance: sender.balance, recipientBalance: recipientUser.balance, balanceWarning: "Balance is lower than 15!" });
    } else {
      res.status(201).json({ msg: 'Transaction sent successfully', senderBalance: sender.balance, recipientBalance: recipientUser.balance });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ msg: error.message || 'Server error' });
  }
});


router.get('/history', verifyToken, async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];
  let envJWT: string = '';

  try {
    if (!token) {
      return res.status(401).json({ msg: 'Token not provided' });
    }

    if (process.env.JWT_SECRET) {
      envJWT = process.env.JWT_SECRET;
    }

    const decoded: any = jwt.verify(token, envJWT);
    const userId = decoded.userId;

    const transactions = await Transaction.find({
      $or: [{ sender: userId }, { recipient: userId }],
    }).populate('sender recipient', 'name email');

    res.status(200).json(transactions);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ msg: error.message || 'Server error' });
  }
});




export default router;
