const express = require('express');
const router = express.Router();
const Medicine = require('../models/medicine');

router.get('/medicines', async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Other routes for CRUD operations...

module.exports = router;
