const Patient = require('../model/patient');
const RegRequest = require('../model/regRequest');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

    const idFile = req.files?.idFile?.[0];
    const medicalDegreeFile = req.files?.medicalDegreeFile?.[0];
    const workingLicenseFile = req.files?.workingLicenseFile?.[0];

    if (!idFile || !medicalDegreeFile || !workingLicenseFile) {
      return res.status(400).json({ error: 'Missing one or more required files' });
    }

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

    const savedRequest = await newRequest.save();

    const saveFilePromises = [
      saveFileData(idFile, 'idFile', savedRequest._id),
      saveFileData(medicalDegreeFile, 'medicalDegreeFile', savedRequest._id),
      saveFileData(workingLicenseFile, 'workingLicenseFile', savedRequest._id),
    ];

    await Promise.all(saveFilePromises);

    res.status(201).json({
      message: 'Registration request submitted successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

async function saveFileData(file, field, requestId) {
  if (file) {
    const { buffer, mimetype } = file;
    const fileData = {
      data: buffer,
      contentType: mimetype,
    };
    await RegRequest.findByIdAndUpdate(requestId, { [field]: fileData });
  }
}

exports.register = async (req, res) => {
  res.render('guest/createPatient');
};

exports.request = async (req, res) => {
  res.render('guest/createRequest');
};

exports.home = async (req, res) => {
  res.render('guest/guestHome');
};