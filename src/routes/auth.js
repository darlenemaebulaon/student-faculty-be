const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();
const jwtSecret = process.env.JWT_SECRET || 'secret';
const jwtExpiry = process.env.JWT_EXPIRES_IN || '7d';

// Register
router.post('/register',
  [
    body('fullName').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    body('role').isIn(['student','faculty','admin']).optional()
  ],
  async (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) 
      return res.status(400).json({ 
    errors: errors.array() 
  });

    const { fullName, email, password, role, studentId } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) return res.status(400).json({ 
        message: 'Email already registered' 
      });

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      user = new User({ 
        fullName, 
        email, 
        password: hashed, 
        role: role || 'student', 
        studentId 
      });

      await user.save();

      const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: jwtExpiry });

      res.json({ 
        token, 
        user: { 
          id: user._id, 
          email: user.email, 
          fullName: user.fullName, 
          role: user.role 
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Login
router.post('/login',
  [ body('email').isEmail(), body('password').exists() ],

  async (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ 
      errors: errors.array() 
    });
    
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });

      if (!user) return res.status(400).json({ 
        message: 'Invalid credentials' 
      });
      
      const matched = await bcrypt.compare(password, user.password);

      if (!matched) return res.status(400).json({ 
        message: 'Invalid credentials' 
      });

      const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: jwtExpiry });

      res.json({ 
        token, 
        user: { id: user._id, 
          email: user.email, 
          fullName: user.fullName, 
          role: user.role 
        }
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ 
        message: 'Server error' 
      });
    }
  }
);

module.exports = router;

