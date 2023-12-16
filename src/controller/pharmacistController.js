const Medicine = require('../model/medicine');
const Pharmacist = require('../model/pharmacist');
const path = require('path');
const io = require('socket.io-client');
const Notification = require('../model/PharmNotification');
const Order = require('../model/order');
const bcrypt = require("bcrypt");

exports.getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json({ medicines });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createMedicine = async (req, res) => {
  try {
    const {
      image,
      name,
      dosage,
      description,
      medUse,
      detail,
      quantity,
      sales,
      price,
      needPres,
    } = req.body;

    const prescriptionRequired = needPres === 'on';

    let existingMedicine = await Medicine.findOne({ name });

    if (existingMedicine) {
      return res.status(404).json({
        message: 'Medicine with the same name already exists',
        medicine: existingMedicine,
      });
    }

    const newMedicine = new Medicine({
      image,
      name,
      dosage,
      description,
      medUse,
      detail,
      quantity,
      sales,
      price,
      needPres: prescriptionRequired,
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

exports.searchMedicines = async (req, res) => {
  try {
    const { search } = req.query;
    const searchRegex = new RegExp(search, 'i');
    const medicines = await Medicine.find({ name: searchRegex });
    res.render('pharmacist/medicines', { medicines });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.editMedicineDetailsAndPrice = async (req, res) => {
  try {
    const { name, dosage, description, medUse, price } = req.body;
    const medicine = await Medicine.findOne({ name });

    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    medicine.dosage = dosage;
    medicine.description = description;
    medicine.medUse = medUse;
    medicine.price = price;

    await medicine.save();

    res.json({
      message: 'Medicine details and price updated successfully',
      medicine,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.filterMedicinesByMedUse = async (req, res) => {
  try {
    const { medUse } = req.query;

    if (!medUse) {
      return res.status(400).json({ error: 'Please provide a "medUse" filter' });
    }

    const medicines = await Medicine.find({ medUse: medUse });
    res.render('pharmacist/medicines', { medicines });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const username = req.session.user.username;

    const pharmacist = await Pharmacist.findOne({ username });

    if (!pharmacist) {
      return res.status(404).json({ message: 'Pharmacist not found' });
    }

    let found = false;
    
    found = await bcrypt.compare(oldPassword, pharmacist.password);

    if (!found) {
      return res.status(401).json({ message: 'Incorrect old password' });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    pharmacist.password = hashedPassword;
    await pharmacist.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const username = req.session.user.username;

    const pharmacist = await Pharmacist.findOne({ username });

    if (!pharmacist) {
      return res.status(404).json({ message: 'Pharmacist not found' });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    pharmacist.password = hashedPassword;
    await pharmacist.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.toggleMedicineStatus = async (req, res) => {
  try {
    const { medicineId } = req.params;
    const medicine = await Medicine.findById(medicineId);

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    medicine.archived = !medicine.archived;

    await medicine.save();

    res.json({ message: 'Status changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.viewWalletAmount = async (req, res) => {
  try {
    const username = req.session.user.username;

    const pharmacist = await Pharmacist.findOne({ username });

    if (!pharmacist) {
      return res.status(404).json({ message: 'Pharmacist not found' });
    }

    const walletAmount = pharmacist.wallet;
    res.status(200).json({ walletAmount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.changePasswordPage = (req, res) => {
  res.render('pharmacist/change-password', { message: null });
};

exports.resetPasswordPage = (req, res) => {
  res.render('pharmacist/resetPassword', { message: null });
};

exports.home = async (req, res) => {
  try {
    const walletAmount = req.session.user.wallet;

    res.render('pharmacist/pharmacistHome', { walletAmount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  res.render('pharmacist/createMedicines');
};

exports.edit = async (req, res) => {
  const { name, dosage, description, medUse, price } = req.body;
  res.render('pharmacist/editMedicine', { name, dosage, description, medUse, price });
};

exports.chat = (req, res) => {
  const pharmacistUsername = req.session.user.username;

  res.render('pharmacist/chat', { pharmacistUsername });

  const socket = io('http://localhost:8000');

  socket.on('connect', () => {
    console.log('Connected to Socket.io server');
    socket.emit('join', { username: pharmacistUsername, userType: 'pharmacist' });
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from Socket.io server');
  });

  socket.on('chat message', (msg) => {
    console.log('Received message:', msg);
  });
};

exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.json({ notifications });
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

    res.json({ totalSales });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sales = async (req, res) => {
  res.render('pharmacist/salesReport');
};

exports.allSoldMedicines = async (req, res) => {
  try {
    const orders = await Order.find({ status: 'placed' });

    let medicineDetails = [];

    for (const order of orders) {
      for (const item of order.shoppingCart) {
        const medicine = await Medicine.findOne({ name: item.medicineName });

        if (medicine) {
          const saleDetails = {
            medicineName: medicine.name,
            sales: parseInt(medicine.sales, 10),
            orderDate: order.orderDate,
          };
          medicineDetails.push(saleDetails);
        } else {
          console.error(`Medicine not found: ${item.medicineName}`);
        }
      }
    }

    res.json({ medicineDetails });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.filterMedicinesByName = async (req, res) => {
  try {
    const { medicineName } = req.query;

    if (!medicineName) {
      return res.status(400).json({ error: 'Medicine name parameter is missing.' });
    }

    const orders = await Order.find({ status: 'placed' });

    let filteredMedicineDetails = [];

    for (const order of orders) {
      for (const item of order.shoppingCart) {
        const medicine = await Medicine.findOne({ name: item.medicineName });

        if (medicine && medicine.name.toLowerCase().includes(medicineName.toLowerCase())) {
          const saleDetails = {
            medicineName: medicine.name,
            sales: parseInt(medicine.sales, 10),
            orderDate: order.orderDate,
          };
          filteredMedicineDetails.push(saleDetails);
        } else {
          console.error(`Medicine not found or does not match the search criteria: ${item.medicineName}`);
        }
      }
    }

    if (filteredMedicineDetails.length > 0) {
      res.json({ medicineDetails: filteredMedicineDetails });
    } else {
      res.json({ medicineDetails: [] });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.filterMedicinesByDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Date parameter is missing.' });
    }

    const orders = await Order.find({
      $expr: {
        $eq: [{ $dateToString: { format: '%Y-%m-%d', date: '$orderDate' } }, date],
      },
      status: 'placed',
    });

    let medicineDetails = [];

    for (const order of orders) {
      for (const item of order.shoppingCart) {
        const medicine = await Medicine.findOne({ name: item.medicineName });

        if (medicine) {
          const saleDetails = {
            medicineName: medicine.name,
            sales: parseInt(medicine.sales, 10),
            orderDate: order.orderDate,
          };
          medicineDetails.push(saleDetails);
        } else {
          console.error(`Medicine not found: ${item.medicineName}`);
        }
      }
    }

    res.json({ medicineDetails });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
