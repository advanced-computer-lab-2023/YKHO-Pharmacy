const mongoose = require('mongoose');

const regRequestSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  hourlyRate: {
    type: String,
    required: true,
  },
  affiliation: {
    type: String,
    required: true,
  },
  educationalBackground: {
    type: String,
    required: true,
  },
  idFile: {
    data: Buffer,
    contentType: String,
  },
  medicalDegreeFile: {
    data: Buffer,
    contentType: String,
  },
  workingLicenseFile: {
    data: Buffer,
    contentType: String,
  },
});

module.exports = mongoose.model('regRequest', regRequestSchema);