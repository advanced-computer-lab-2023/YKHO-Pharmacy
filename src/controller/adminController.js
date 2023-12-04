const Medicine = require('../model/medicine');
const Administrator = require('../model/administrator');
const Pharmacist = require('../model/pharmacist');
const Patient = require('../model/patient');
const RegRequest = require('../model/regRequest');
const Order = require('../model/order');

exports.getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json({ medicines });
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
    const { username, password, email } = req.body;

    console.log(req.session.user.username);
    // Check if username already exists
    const existingAdministrator = await Administrator.findOne({ username });
    if (existingAdministrator) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const newAdministrator = new Administrator({ username, password, email });
    await newAdministrator.save();

    res.status(201).json({ message: 'Administrator added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removePharmacist = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if pharmacist exists
    const pharmacist = await Pharmacist.findOne({ name });
    if (!pharmacist) {
      return res.status(404).json({ message: 'Pharmacist not found' });
    }

    await Pharmacist.findOneAndDelete({ name });

    res.json({ message: 'Pharmacist removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removePatient = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if patient exists
    const patient = await Patient.findOne({ name });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    await Patient.findOneAndDelete({ name });

    res.json({ message: 'Patient removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPharmacist = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if pharmacist exists
    const pharmacist = await Pharmacist.findOne({ name });
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
    const { name } = req.body;

    // Check if patient exists
    const patient = await Patient.findOne({ name });
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

    // Add file URLs to each request object
    const requestsWithFileURLs = getRequests.map(request => ({
      ...request._doc,
      idFileURL: request.idFile ? `/uploads/${request._id}/idFile` : null,
      medicalDegreeFileURL: request.medicalDegreeFile ? `/uploads/${request._id}/medicalDegreeFile` : null,
      workingLicenseFileURL: request.workingLicenseFile ? `/uploads/${request._id}/workingLicenseFile` : null,
    }));

    res.json({ getRequests: requestsWithFileURLs });
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

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const username = req.session.user.username;

    const admin = await Administrator.findOne({ username });

    if (!admin) {
      return res.status(404).json({ message: 'Administrator not found' });
    }

    if (oldPassword !== admin.password) {
      return res.status(401).json({ message: 'Incorrect old password' });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const username = req.session.user.username;

    const admin = await Administrator.findOne({ username });

    if (!admin) {
      return res.status(404).json({ message: 'admin not found' });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.changePasswordPage = (req, res) => {
  res.render('admin/change-password', { message: null });
};

exports.resetPasswordPage = (req, res) => {
  res.render('admin/resetPassword', { message: null });
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

exports.sales = async (req, res) => {
  res.render('admin/salesReport');
};

exports.acceptRequest = async (req, res) => {
  const { requestId } = req.body;
  try {
    
    const request = await RegRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    
    const newPharmacist = new Pharmacist({
      username: request.username,
      name: request.name,
      email: request.email,
      password: request.password, 
      dateOfBirth: request.dateOfBirth,
      hourlyRate: request.hourlyRate,
      affiliation: request.affiliation,
      educationalBackground: request.educationalBackground,
    });

    
    await newPharmacist.save();

    
    await RegRequest.findByIdAndDelete(requestId);
    res.redirect('/admin/getRequests');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.rejectRequest = async (req, res) => {
  const { requestId } = req.body;
  try {
  
    const request = await RegRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    
    await RegRequest.findByIdAndDelete(requestId);

    res.redirect('/admin/getRequests');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrdersByMonth = async (req, res) => {
  try {
    const { month } = req.body;

    if (!month) {
      return res.status(400).json({ error: 'Month parameter is missing.' });
    }

    const parsedMonth = parseInt(month, 10);

    if (isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
      return res.status(400).json({ error: 'Invalid month parameter.' });
    }

    const orders = await Order.find({
      $expr: {
        $eq: [{ $month: '$orderDate' }, parsedMonth],
      },
      status: 'placed',
    });

    let totalSales = 0;

    for (const order of orders) {
      for (const item of order.shoppingCart) {
        const medicine = await Medicine.findOne({ name: item.medicineName });

        if (medicine) {
          totalSales += parseInt(medicine.sales, 10);
        } else {
          console.error(`Medicine not found: ${item.medicineName}`);
        }
      }
    }

    res.render('admin/totalSales', { totalSales });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
