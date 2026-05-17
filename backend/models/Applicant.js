const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  sex: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  age: { type: Number, required: true },
  location: { type: String, required: true },
  occupation: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Accepted', 'Denied'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Applicant', applicantSchema);
