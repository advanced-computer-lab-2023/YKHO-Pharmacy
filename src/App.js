const express = require('express');
const cors = require('cors');
const app = express();
// Use cors middleware
app.use(cors({ 
  origin: 'http://localhost:3000',
  credentials: true,
}));


const port = process.env.PORT || 8000;
const mongoose = require('mongoose');
const multer = require('multer');
const RegRequest = require('./model/regRequest');
const http = require('http');
const socketServer = require('./socketServer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const server = http.createServer(app);
const io = socketServer.initializeSocket(server);

require('dotenv').config();

const uri = process.env.MONGODB_URI;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(uri, {
  dbName: 'pharmacyDB',
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

const session = require('express-session');
app.use(session({
  secret: 'your-secret-key', // Replace with a strong secret key
  resave: false,
  saveUninitialized: true,
}));

//schemas
const Administrator = require('./model/administrator');
const Pharmacist = require('./model/pharmacist');
const Patient = require('./model/patient');
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

//controllers
const adminController = require('./controller/adminController');
const patientController = require('./controller/patientController');
const pharmacistController = require('./controller/pharmacistController');
const guestController = require('./controller/guestController');

app.use(express.json());

//admin
app.get('/admin/adminHome', isAuthenticated, adminController.home);
app.get('/admin/addadministrator', isAuthenticated, adminController.adminAdd);
app.post('/admin/addadministrator', adminController.addAdministrator);
app.get('/admin/removePharmacist', isAuthenticated, adminController.pharmacistRemove);
app.post('/admin/removePharmacist', adminController.removePharmacist);
app.get('/admin/removePatient', isAuthenticated, adminController.patientRemove);
app.post('/admin/removePatient', adminController.removePatient);
app.get('/admin/getPatient', isAuthenticated, adminController.patientGet);
app.post('/admin/getPatient', adminController.getPatient);
app.get('/admin/getPharmacist', isAuthenticated, adminController.pharmacistGet);
app.post('/admin/getPharmacist', adminController.getPharmacist);
app.get('/admin/getRequests', isAuthenticated, adminController.getRequests);
app.post('/admin/acceptRequest', adminController.acceptRequest); 
app.post('/admin/rejectRequest', adminController.rejectRequest); 
app.get('/admin/medicines', isAuthenticated, adminController.getMedicines);
app.get('/admin/searchMedicines', isAuthenticated, adminController.searchMedicines);
app.get('/admin/medicines/filter', isAuthenticated, adminController.filterMedicinesByMedUse);
app.get('/admin/change-password', adminController.changePasswordPage);
app.post('/admin/change-password', adminController.changePassword);
app.get('/admin/resetPassword', adminController.resetPasswordPage);
app.post('/admin/resetPassword', adminController.resetPassword);
app.get('/admin/salesReport', isAuthenticated, adminController.sales);
app.post('/admin/salesReport', isAuthenticated, adminController.getOrdersByMonth);

//patient
app.get('/patient/patientHome', isAuthenticated,patientController.home)
app.get('/patient/medicines', isAuthenticated, patientController.getMedicines);
app.get('/patient/searchMedicines', isAuthenticated, patientController.searchMedicines);
app.get('/patient/medicines/filter', isAuthenticated, patientController.filterMedicinesByMedUse);
app.get('/patient/change-password', patientController.changePasswordPage);
app.post('/patient/change-password', patientController.changePassword);
app.get('/patient/resetPassword', patientController.resetPasswordPage);
app.post('/patient/resetPassword', patientController.resetPassword);
app.post('/patient/addToCart', isAuthenticated, patientController.addToCart);
app.get('/patient/ShoppingCart', isAuthenticated, patientController.getShoppingCart);
app.post('/patient/removeFromCart', isAuthenticated, patientController.removeFromCart);
app.post('/patient/editCartItemQuantity', isAuthenticated, patientController.editCartItemQuantity);
app.get('/patient/getcheckout', isAuthenticated, patientController.getcheckoutPage);
app.post('/patient/addAddress', isAuthenticated, patientController.addAddress);
app.post('/patient/checkout', isAuthenticated, patientController.checkout);
app.post('/patient/emptyCart', isAuthenticated, patientController.emptyCart);
app.get('/patient/success', isAuthenticated, patientController.getsuccessPage);
app.post('/patient/failedOrder', isAuthenticated, patientController.failedOrder);
app.get('/patient/failure', isAuthenticated, patientController.getfailurePage);
app.get('/patient/orders',isAuthenticated,patientController.getorders);
app.post('/patient/cancelOrder', isAuthenticated, patientController.cancelOrder);
app.get('/patient/wallet',isAuthenticated,patientController.viewWalletAmount);
app.get('/patient/chat', isAuthenticated,patientController.chat);

//pharmacist
app.get('/pharmacist/pharmacistHome', isAuthenticated,pharmacistController.home)
app.get('/pharmacist/medicines', isAuthenticated, pharmacistController.getMedicines);
app.get('/pharmacist/createMedicines', isAuthenticated,pharmacistController.create);
app.post('/pharmacist/createMedicines', pharmacistController.createMedicine);
app.get('/pharmacist/searchMedicines', isAuthenticated, pharmacistController.searchMedicines);
app.get('/pharmacist/medicines/filter', isAuthenticated, pharmacistController.filterMedicinesByMedUse);
app.post('/pharmacist/edit', isAuthenticated,pharmacistController.edit);
app.post('/pharmacist/editMedicine', pharmacistController.editMedicineDetailsAndPrice)
app.get('/pharmacist/change-password', isAuthenticated, pharmacistController.changePasswordPage);
app.post('/pharmacist/change-password', pharmacistController.changePassword);
app.get('/pharmacist/resetPassword', pharmacistController.resetPasswordPage);
app.post('/pharmacist/resetPassword', pharmacistController.resetPassword);
app.post('/pharmacist/archive/:medicineId', pharmacistController.toggleMedicineStatus);
app.get('/pharmacist/wallet',isAuthenticated,pharmacistController.viewWalletAmount);
app.get('/pharmacist/chat', isAuthenticated,pharmacistController.chat);
app.get('/pharmacist/notifications', isAuthenticated,pharmacistController.getAllNotifications);
app.get('/pharmacist/salesReport', isAuthenticated, pharmacistController.sales);
app.post('/pharmacist/salesReport', isAuthenticated, pharmacistController.getOrdersByMonth);
app.get('/pharmacist/allSoldMedicinesReport', isAuthenticated, pharmacistController.allSoldMedicines);
app.get('/pharmacist/filterMedicinesByName', isAuthenticated, pharmacistController.filterMedicinesByName);
app.get('/pharmacist/filterMedicinesByDate', isAuthenticated, pharmacistController.filterMedicinesByDate);

//guest
app.get('/guest/guestHome',guestController.home)
app.get('/guest/createPatient', guestController.register);
app.post('/guest/createPatient', guestController.createPatient);
app.get('/guest/createRequest', guestController.request);
app.post('/guest/createRequest', upload.fields([
  { name: 'idFile', maxCount: 1 },
  { name: 'medicalDegreeFile', maxCount: 1 },
  { name: 'workingLicenseFile', maxCount: 1 }
]), guestController.createRequest);
app.get('/fetchFile', async (req, res) => {
  try {
    const requestId = req.query.id;
    const fileType = req.query.type;
    // Retrieve file data from the database based on requestId and fileType
    const request = await RegRequest.findById(requestId);

    if (!request || !request[fileType]) {
      return res.status(404).send('File not found');
    }

    const fileData = request[fileType];
    res.set('Content-Type', fileData.contentType);
    res.send(fileData.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


//login
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Administrator.findOne({ username });

    if (admin && admin.password === password) {
      req.session.user = admin;
      return res.json({ userType: 'admin' });
    }

    const patient = await Patient.findOne({ username });

    if (patient && patient.password === password) {
      req.session.user = patient;
      return res.json({ userType: 'patient' });
    }

    const pharmacist = await Pharmacist.findOne({ username });

    if (pharmacist && pharmacist.password === password) {
      req.session.user = pharmacist;
      return res.json({ userType: 'pharmacist' });
    }

     res.status(401).json({ error: 'Invalid username or password' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});



//logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/login');
  });
});

//authentication
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

//OTP
const { transport, generateOTP } = require('./emailConfig');

app.get('/enter-otp', (req, res) => {
  res.render('enter-otp', { message: null });
});

app.get('/request-reset', (req, res) => {
  res.render('request-reset', { message: null });
});

app.post('/request-reset', async (req, res) => {
  const { email } = req.body;

  const patient = await Patient.findOne({ email });

  if (patient) {
    req.session.user = patient;
    req.session.userType = 'patient';
  } else {
    const pharmacist = await Pharmacist.findOne({ email });
    const admin = await Administrator.findOne({ email });
    if (pharmacist) {
      req.session.user = pharmacist;
      req.session.userType = 'pharmacist';
    }else if (admin) {
      req.session.user = admin;
      req.session.userType = 'admin';
    } else {
      return res.status(404).json({ message: 'Email not found' });
    }
  }

  const otp = generateOTP();

  req.session.otp = otp;
  console.log("Sent OTP: ", req.session.otp);

  const mailOptions = {
    from: 'yoyo_ah360@hotmail.com',
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP for password reset: ${otp}`,
  };

  transport.sendMail(mailOptions, (error) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Failed to send OTP' });
    } else {
      res.redirect('/enter-otp');
    }
  });
});

app.use((req, res, next) => {
  console.log('Session:', req.session);
  next();
});

app.post('/verify-otp', (req, res) => {
  const { otp } = req.body;
  
  console.log("Recieved OTP: ", otp);
  console.log("Saved OTP: ", req.session.otp);
  if (otp === req.session.otp) {
    const userType = req.session.userType;
    
    if (userType === 'patient') {
      return res.json({ userType: 'patient' });
    } else if (userType === 'pharmacist') {
      return res.json({ userType: 'pharmacist' });
    } else {
      return res.json({ userType: 'admin' });
    }    
  } else {
    return res.status(401).json({ message: 'Invalid OTP' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});