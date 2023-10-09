const Medicine = require('../model/medicine');

exports.getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
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
    } = req.body;

    const existingMedicine = await Medicine.findOne({ name });

    if (existingMedicine) {
      return res.status(400).json({ error: 'Medicine already exists' });
    }

    const newMedicine = new Medicine({
      name,
      dosage,
      description,
      medUse,
      detail,
      quantity,
      sales,
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

// Other routes for CRUD operations...

