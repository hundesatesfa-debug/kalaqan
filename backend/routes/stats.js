const express = require('express');
const Applicant = require('../models/Applicant');
const jwt = require('jsonwebtoken');
const dbFallback = require('../dbFallback');

const router = express.Router();

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

router.get('/', authMiddleware, async (req, res) => {
  try {
    if (!dbFallback.isMongoConnected()) {
      const stats = dbFallback.getStats();
      return res.json(stats);
    }

    const totalRegistrations = await Applicant.countDocuments();
    
    // Status stats
    const statusCounts = await Applicant.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Gender stats
    const genderCounts = await Applicant.aggregate([
      { $group: { _id: '$sex', count: { $sum: 1 } } }
    ]);

    // Age stats
    const ageGroups = await Applicant.aggregate([
      {
        $bucket: {
          groupBy: "$age",
          boundaries: [0, 18, 25, 35, 45, 60, 100],
          default: "Other",
          output: { count: { $sum: 1 } }
        }
      }
    ]);

    // Location stats
    const locationCounts = await Applicant.aggregate([
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      totalRegistrations,
      statusCounts,
      genderCounts,
      ageGroups,
      locationCounts
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
