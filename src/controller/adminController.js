const Medicine = require('../model/medicine');
const Administrator = require('../model/administrator');
const Pharmacist = require('../model/pharmacist');
const Patient = require('../model/patient');
const RegRequest = require('../model/regRequest');

exports.getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.render('admin/medicines', { medicines });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchMedicines = async (req, res) => {
  try {
    const { search } = req.query;
    const searchRegex = new RegExp(search, 'i');
    const medicines = await Medicine.find({ name: searchRegex });
    res.render('admin/medicines', { medicines });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addAdministrator = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username already exists
    const existingAdministrator = await Administrator.findOne({ username });
    if (existingAdministrator) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const newAdministrator = new Administrator({ username, password });
    await newAdministrator.save();

    res.status(201).json({ message: 'Administrator added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removePharmacist = async (req, res) => {
  try {
    const { username } = req.body;

    // Check if pharmacist exists
    const pharmacist = await Pharmacist.findOne({ username });
    if (!pharmacist) {
      return res.status(404).json({ message: 'Pharmacist not found' });
    }

    await Pharmacist.findOneAndDelete({ username });

    res.json({ message: 'Pharmacist removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removePatient = async (req, res) => {
  try {
    const { username } = req.body;

    // Check if patient exists
    const patient = await Patient.findOne({ username });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    await Patient.findOneAndDelete({ username });

    res.json({ message: 'Patient removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPharmacist = async (req, res) => {
  try {
    const { username } = req.body;

    // Check if pharmacist exists
    const pharmacist = await Pharmacist.findOne({ username });
    if (!pharmacist) {
      return res.status(404).json({ message: 'Pharmacist not found' });
    }

    res.json(pharmacist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPatient = async (req, res) => {
  try {
    const { username } = req.body;

    // Check if patient exists
    const patient = await Patient.findOne({ username });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRequests = async (req, res) => {
  try {
    const getRequests = await RegRequest.find();
    res.render('admin/getRequests', { getRequests });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.filterMedicinesByMedUse = async (req, res) => {
  try {
    const { medUse } = req.query;

    if (!medUse) {
      return res.status(400).json({ error: 'No results found.' });
    }

    const medicines = await Medicine.find({ medUse: medUse });
    res.render('admin/medicines', { medicines });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.home = async (req, res) => {
  res.render('admin/adminHome');
};

exports.adminAdd = async (req, res) => {
  res.render('admin/addadministrator');
};

exports.pharmacistGet = async (req, res) => {
  res.render('admin/getPharmacist');
};

exports.pharmacistRemove = async (req, res) => {
  res.render('admin/removePharmacist');
};

exports.patientGet = async (req, res) => {
  res.render('admin/getPatient');
};

exports.patientRemove = async (req, res) => {
  res.render('admin/removePatient');
};