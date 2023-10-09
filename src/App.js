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

app.use(express.json());

//admin
app.get('/medicines', adminController.getMedicines);

//patient
app.get('/medicines', patientController.getMedicines);

//pharmacist
app.get('/medicines', patientController.getMedicines);
app.post('/createMedicines', pharmacistController.createMedicine);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
