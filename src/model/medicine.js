const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  image: {
    type: String,
  },
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
  needPres: {
    type: Boolean,
    default: false,
  },
  archived: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Medicine', medicineSchema);
