const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // Import the body-parser middleware
require('dotenv').config();

const uri = process.env.MONGODB_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

const medicineController = require('./controller/medicineController');

app.use(express.json());

app.get('/medicines', medicineController.getMedicines);

app.post('/createMedicines', medicineController.createMedicine);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
