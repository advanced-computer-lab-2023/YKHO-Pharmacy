const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  dosage: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  medUse: {
    type: String,
    required: true,
  },
  detail: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  sales: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Medicine', medicineSchema);
