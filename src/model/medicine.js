const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: String,
  dosage: String,
  description: String,
  medUse: String,
  detail: String,
  quantity: String,
  sales: String 
});

module.exports = mongoose.model('Medicine', medicineSchema);
