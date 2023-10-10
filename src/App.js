const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

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
app.post('/addadministrator', adminController.addAdministrator);
app.post('/removePatient', adminController.removePatient);
app.get('/getPatient', adminController.getPatient);
app.get('/getPharmacist', adminController.getPharmacist);
app.get('/medicines', adminController.getMedicines);
app.get('/searchMedicines', adminController.searchMedicines);

//patient
app.get('/medicines', patientController.getMedicines);
app.get('/searchMedicines', patientController.searchMedicines);

//pharmacist
app.get('/medicines', patientController.getMedicines);
app.post('/createMedicines', pharmacistController.createMedicine);
app.get('/searchMedicines', pharmacistController.searchMedicines);
app.get('/getDetailSales', pharmacistController.getMedicinesWithDetailsAndSales)
app.post('/editMedicine', pharmacistController.editMedicineDetailsAndPrice)

//guest
app.post('/createPatient', guestController.createPatient);
app.post('/createRequest', guestController.createRequest);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
