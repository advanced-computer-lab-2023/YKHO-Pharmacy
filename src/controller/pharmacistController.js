const Medicine = require('../model/medicine');

exports.getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.render('pharmacist/medicines', { medicines });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createMedicine = async (req, res) => {
  try {
    const {
      name,
      dosage,
      description,
      medUse,
      detail,
      quantity,
      sales,
      price,
    } = req.body;

    let existingMedicine = await Medicine.findOne({ name });

    if (existingMedicine) {
      existingMedicine.quantity = parseInt(existingMedicine.quantity) + parseInt(quantity);
      await existingMedicine.save();

      return res.json({
        message: 'Medicine quantity updated successfully',
        medicine: existingMedicine,
      });
    }

    const newMedicine = new Medicine({
      name,
      dosage,
      description,
      medUse,
      detail,
      quantity,
      sales,
      price,
    });

    await newMedicine.save();

    res.status(201).json({
      message: 'Medicine added successfully',
      medicine: newMedicine,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchMedicines = async (req, res) => {
  try {
    const { search } = req.query;
    const searchRegex = new RegExp(search, 'i');
    const medicines = await Medicine.find({ name: searchRegex });
    res.render('pharmacist/medicines', { medicines });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMedicinesWithDetailsAndSales = async (req, res) => {
  try {
    const medicines = await Medicine.find({}, { _id: 0, detail: 1, sales: 1 });
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.editMedicineDetailsAndPrice = async (req, res) => {
  try {
    const { name, detail, price } = req.body;
    const medicine = await Medicine.findOne({ name });

    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    medicine.detail = detail;
    medicine.price = price;

    await medicine.save();

    res.json({
      message: 'Medicine details and price updated successfully',
      medicine,
    });
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
    res.render('pharmacist/medicines', { medicines });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.home = async (req, res) => {
  res.render('pharmacist/pharmacistHome');
};

// Other routes for CRUD operations...