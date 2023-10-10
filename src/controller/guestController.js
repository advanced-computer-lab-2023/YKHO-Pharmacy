const Patient = require('../model/patient');
const RegRequest = require('../model/regRequest');

exports.createPatient = async (req, res) => {
  try {
    const {
      username,
      name,
      email,
      password,
      dateOfBirth,
      gender,
      mobileNumber,
      emergencyContact,
    } = req.body;

    const existingPatient = await Patient.findOne({
      $or: [{ username }, { email }],
    });

    if (existingPatient) {
      return res.status(400).json({ error: 'Patient with the same username or email already exists' });
    }

    const newPatient = new Patient({
      username,
      name,
      email,
      password,
      dateOfBirth,
      gender,
      mobileNumber,
      emergencyContact,
    });

    await newPatient.save();

    res.status(201).json({
      message: 'Patient created successfully'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.createRequest = async (req, res) => {
    try {
      const {
        username,
        name,
        email,
        password,
        dateOfBirth,
        hourlyRate,
        affiliation,
        educationalBackground,
      } = req.body;
  
      const newRequest = new RegRequest({
        username,
        name,
        email,
        password,
        dateOfBirth,
        hourlyRate,
        affiliation,
        educationalBackground,
      });
  
      await newRequest.save();
  
      res.status(201).json({
        message: 'Registration request created successfully'
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  exports.register = async (req, res) => {
    res.render('guest/createPatient');
  };

  exports.request = async (req, res) => {
    res.render('guest/createRequest');
  };