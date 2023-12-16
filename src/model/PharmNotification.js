const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
});

const PharmNotification = mongoose.model('PharmNotification', notificationSchema);

module.exports = PharmNotification;
