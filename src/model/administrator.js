const mongoose = require('mongoose');

const administratorSchema = new mongoose.Schema({
  username: String,
  password: String,
});

module.exports = mongoose.model('Administrator', administratorSchema);
