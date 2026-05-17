const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, 'db.json');

// Initialize with some mock data if it doesn't exist
if (!fs.existsSync(dbPath)) {
  const initialData = {
    users: [
      {
        _id: 'mock-admin-id',
        username: 'admin',
        password: 'pbkdf2_hashed_or_plain'
      }
    ],
    applicants: [],
    events: []
  };
  fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
}

function getData() {
  try {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch (e) {
    return { users: [], applicants: [], events: [] };
  }
}

function saveData(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = {
  isMongoConnected() {
    const mongoose = require('mongoose');
    return mongoose.connection.readyState === 1;
  },
  
  getApplicants() {
    return getData().applicants;
  },
  
  addApplicant(applicant) {
    const data = getData();
    const newApp = {
      _id: Math.random().toString(36).substr(2, 9),
      status: 'Pending',
      createdAt: new Date(),
      ...applicant
    };
    data.applicants.push(newApp);
    saveData(data);
    return newApp;
  },
  
  updateApplicantStatus(id, status) {
    const data = getData();
    const app = data.applicants.find(a => a._id === id);
    if (app) {
      app.status = status;
      saveData(data);
    }
    return app;
  },
  
  deleteApplicant(id) {
    const data = getData();
    data.applicants = data.applicants.filter(a => a._id !== id);
    saveData(data);
  },
  
  getStats() {
    const applicants = getData().applicants;
    const totalRegistrations = applicants.length;
    
    // Status counts
    const statusCounts = {};
    applicants.forEach(a => {
      statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
    });
    const statusCountsArr = Object.entries(statusCounts).map(([key, value]) => ({ _id: key, count: value }));
    
    // Gender counts
    const genderCounts = {};
    applicants.forEach(a => {
      genderCounts[a.sex] = (genderCounts[a.sex] || 0) + 1;
    });
    const genderCountsArr = Object.entries(genderCounts).map(([key, value]) => ({ _id: key, count: value }));
    
    // Age bucket stats (0, 18, 25, 35, 45, 60, 100)
    const ageBuckets = [
      { min: 0, max: 18, label: 'Under 18' },
      { min: 18, max: 25, label: '18-24' },
      { min: 25, max: 35, label: '25-34' },
      { min: 35, max: 45, label: '35-44' },
      { min: 45, max: 60, label: '45-59' },
      { min: 60, max: 100, label: '60+' }
    ];
    const ageGroups = ageBuckets.map(b => ({ _id: b.min, count: 0 }));
    applicants.forEach(a => {
      const val = parseInt(a.age);
      const bucketIndex = ageBuckets.findIndex(b => val >= b.min && val < b.max);
      if (bucketIndex !== -1) {
        ageGroups[bucketIndex].count++;
      }
    });
    
    // Location counts
    const locationCounts = {};
    applicants.forEach(a => {
      locationCounts[a.location] = (locationCounts[a.location] || 0) + 1;
    });
    const locationCountsArr = Object.entries(locationCounts)
      .map(([key, value]) => ({ _id: key, count: value }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
      
    return {
      totalRegistrations,
      statusCounts: statusCountsArr,
      genderCounts: genderCountsArr,
      ageGroups,
      locationCounts: locationCountsArr
    };
  }
};
