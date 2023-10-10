const mongoose = require('mongoose');

const pharmacistSchema = new mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  dateOfBirth: Date,
  hourlyRate: String,
  affiliation: String,
  educationalBackground: String
});

module.exports = mongoose.model('Pharmacist', pharmacistSchema);
