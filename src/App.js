const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

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

//controller
const adminController = require('./controller/adminController');
const patientController = require('./controller/patientController');
const pharmacistController = require('./controller/pharmacistController');
const guestController = require('./controller/guestController');

app.use(express.json());

//admin
app.get('/admin/adminHome',adminController.home)

app.get('/admin/addadministrator', adminController.adminAdd);
app.post('/admin/addadministrator', adminController.addAdministrator);

app.get('/admin/removePharmacist', adminController.pharmacistRemove);
app.post('/admin/removePharmacist', adminController.removePharmacist);

app.get('/admin/removePatient', adminController.patientRemove);
app.post('/admin/removePatient', adminController.removePatient);

app.post('/admin/getPatient', adminController.getPatient);
app.post('/admin/getPharmacist', adminController.getPharmacist);
app.get('/admin/getRequests', adminController.getRequests);
app.get('/admin/medicines', adminController.getMedicines);
app.get('/admin/searchMedicines', adminController.searchMedicines);
app.get('/admin/medicines/filter', adminController.filterMedicinesByMedUse);

//patient
app.get('/patient/patientHome',patientController.home)
app.get('/patient/medicines', patientController.getMedicines);
app.get('/patient/searchMedicines', patientController.searchMedicines);
app.get('/patient/medicines/filter', patientController.filterMedicinesByMedUse);

//pharmacist
app.get('/pharmacist/pharmacistHome',pharmacistController.home)
app.get('/pharmacist/medicines', pharmacistController.getMedicines);
app.post('/pharmacist/createMedicines', pharmacistController.createMedicine);
app.get('/pharmacist/searchMedicines', pharmacistController.searchMedicines);
app.get('/pharmacist/getDetailSales', pharmacistController.getMedicinesWithDetailsAndSales)
app.post('/pharmacist/editMedicine', pharmacistController.editMedicineDetailsAndPrice)
app.get('/pharmacist/medicines/filter', pharmacistController.filterMedicinesByMedUse);

//guest
app.get('/guest/guestHome',guestController.home)
app.post('/guest/createPatient', guestController.createPatient);
app.post('/guest/createRequest', guestController.createRequest);
app.get('/guest/createPatient', guestController.register);
app.get('/guest/createRequest', guestController.request);

//home
app.get('/', (req, res) => {
  res.render('home');
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
