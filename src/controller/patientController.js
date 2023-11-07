const Medicine = require('../model/medicine');
const Patient = require('../model/patient');

exports.getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.render('patient/medicines', { medicines });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchMedicines = async (req, res) => {
  try {
    const { search } = req.query;
    const searchRegex = new RegExp(search, 'i');
    const medicines = await Medicine.find({ name: searchRegex });
    res.render('patient/medicines', { medicines });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.filterMedicinesByMedUse = async (req, res) => {
  try {
    const { medUse } = req.query;

    if (!medUse) {
      return res.status(400).json({ error: 'Please provide a "medUse" filter' });
    }

    const medicines = await Medicine.find({ medUse: medUse });
    res.render('patient/medicines', { medicines });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const username = req.session.user.username;

    const patient = await Patient.findOne({ username });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    if (oldPassword !== patient.password) {
      return res.status(401).json({ message: 'Incorrect old password' });
    }

    patient.password = newPassword;
    await patient.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const username = req.session.user.username;

    const patient = await Patient.findOne({ username });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    patient.password = newPassword;
    await patient.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.changePasswordPage = (req, res) => {
  res.render('patient/change-password', { message: null });
};

exports.resetPasswordPage = (req, res) => {
  res.render('patient/resetPassword', { message: null });
};

exports.home = async (req, res) => {
  res.render('patient/patientHome');
};