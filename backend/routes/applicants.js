const express = require('express');
const Applicant = require('../models/Applicant');
const jwt = require('jsonwebtoken');
const dbFallback = require('../dbFallback');

const router = express.Router();

// Middleware to authenticate admin
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Create a new application (Public)
router.post('/', async (req, res) => {
  try {
    let newApplicant;
    if (!dbFallback.isMongoConnected()) {
      newApplicant = dbFallback.addApplicant(req.body);
    } else {
      newApplicant = new Applicant(req.body);
      await newApplicant.save();
    }

    // Emit event for real-time notification
    req.io.emit('new_applicant', newApplicant);

    res.status(201).json({ message: 'Registration successful', applicant: newApplicant });
  } catch (error) {
    res.status(400).json({ message: 'Error registering', error: error.message });
  }
});

// Get all applications (Admin)
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (!dbFallback.isMongoConnected()) {
      const applicants = dbFallback.getApplicants().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(applicants);
    }
    const applicants = await Applicant.find().sort({ createdAt: -1 });
    res.json(applicants);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update applicant status (Admin)
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!dbFallback.isMongoConnected()) {
      const applicant = dbFallback.updateApplicantStatus(req.params.id, status);
      if (!applicant) return res.status(404).json({ message: 'Applicant not found' });
      return res.json(applicant);
    }
    const applicant = await Applicant.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!applicant) return res.status(404).json({ message: 'Applicant not found' });
    res.json(applicant);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an applicant (Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (!dbFallback.isMongoConnected()) {
      dbFallback.deleteApplicant(req.params.id);
      return res.json({ message: 'Applicant deleted' });
    }
    await Applicant.findByIdAndDelete(req.params.id);
    res.json({ message: 'Applicant deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
