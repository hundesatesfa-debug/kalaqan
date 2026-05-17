const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dbFallback = require('../dbFallback');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Fallback to local admin credentials if MongoDB is not connected
  if (!dbFallback.isMongoConnected()) {
    if (username === 'admin' && password === 'admin123') {
      const token = jwt.sign({ id: 'mock-admin-id' }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1h' });
      return res.json({ token, username: 'admin' });
    } else {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
  }

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1h' });
    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Seed admin user if it doesn't exist
router.post('/seed', async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) return res.status(400).json({ message: 'Admin already exists' });

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({ username: 'admin', password: hashedPassword });
    await admin.save();
    res.json({ message: 'Admin seeded successfully (admin / admin123)' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
