// server/routes/auth.ts
import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();

// @route   POST api/auth/signup
// @desc    Register user
// @access  Public
router.post('/signup', async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/login
// @desc    Authenticate user
// @access  Public
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      // Check if the password is correct
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(404).json({ msg: 'Invalid credentials' });
      }
  
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
            expiresIn: '1h' 
        });

      res.status(200).json({ msg: 'Logged in successfully', token, user });
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });


export default router;
