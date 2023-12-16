const Medicine = require('../model/medicine');
const Patient = require('../model/patient');
const Order = require('../model/order');
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const path = require('path');
const io = require('socket.io-client');
const sendOutOfStockEmail = require('../sendOutOfStockEmail');
const Notification = require('../model/PharmNotification');
const Pharmacist = require('../model/pharmacist');
const moment = require('moment');
const bcrypt = require("bcrypt");

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
    res.render('patient/medicines', { medicines });
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
    res.render('patient/medicines', { medicines });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const username = req.session.user.username;

    const patient = await Patient.findOne({ username });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    let found = false;
    
    found = await bcrypt.compare(oldPassword, patient.password);

    if (!found) {
      return res.status(401).json({ message: 'Incorrect old password' });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    patient.password = hashedPassword;
    await patient.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const username = req.session.user.username;

    const patient = await Patient.findOne({ username });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    patient.password = hashedPassword;
    await patient.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { medicineName, medicinePrice, quantity } = req.body;
    const username = req.session.user.username;

    const patient = await Patient.findOne({ username });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const availableMedicine = await Medicine.findOne({ name: medicineName });

    if (!availableMedicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    if (quantity > availableMedicine.quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const cartItem = patient.shoppingCart.find(item => item.medicineName === medicineName);

    if (!cartItem) {
      patient.shoppingCart.push({ medicineName, quantity, medicinePrice });
    } else {
      cartItem.quantity += quantity;
    }

    await patient.save();

    return res.status(200).json({ message: 'Medicine added to the shopping cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getShoppingCart = async (req, res) => {
  try {
    const username = req.session.user.username;

    const patient = await Patient.findOne({ username });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const shoppingCart = patient.shoppingCart;

    res.json({ shoppingCart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getorders = async (req, res) => {
  try {
    const username = req.session.user.username;

    const orders = await Order.find({ username });

    if (orders.length === 0) {
      return res.status(404).json({ message: 'You have No Orders' });
    }

    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { medicineName } = req.body;
    const username = req.session.user.username;

    const patient = await Patient.findOne({ username });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const itemIndex = patient.shoppingCart.findIndex(item => item.medicineName === medicineName);

    if (itemIndex !== -1) {
      patient.shoppingCart.splice(itemIndex, 1);

      await patient.save();

      res.redirect('/patient/shoppingCart');
    } else {
      return res.status(404).json({ message: 'Medicine not found in the shopping cart' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.editCartItemQuantity = async (req, res) => {
  try {
    const { medicineName, newQuantity } = req.body;
    const username = req.session.user.username;

    const patient = await Patient.findOne({ username });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const item = patient.shoppingCart.find((cartItem) => cartItem.medicineName === medicineName);

    if (!item) {
      return res.status(400).json({ message: 'Medicine not found in the shopping cart' });
    }

    const availableMedicine = await Medicine.findOne({ name: medicineName });

    if (!availableMedicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    const availableQuantity = parseInt(availableMedicine.quantity, 10);

    if (newQuantity > availableQuantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    item.quantity = newQuantity;

    if (item.quantity <= 0) {
      patient.shoppingCart = patient.shoppingCart.filter((cartItem) => cartItem.medicineName !== medicineName);
    }

    await patient.save();

    res.redirect('/patient/shoppingCart');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getcheckoutPage = async (req, res) => {
  try {
    const username = req.session.user.username;

    const patient = await Patient.findOne({ username });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const deliveryAdd = patient.deliveryAdd;
    const shoppingCart = patient.shoppingCart;

    res.json({ deliveryAdd, shoppingCart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const { newAddress } = req.body;

    // Check if the delivery address is already stored in the patient's profile
    const username = req.session.user.username;

    const patient = await Patient.findOne({ username });

    const addressExists = patient.deliveryAdd.some((address) => address.address === newAddress);

    // If the address is not stored, add it
    if (!addressExists) {
      patient.deliveryAdd.push({ address: newAddress });
      await patient.save();
    }
      // Address already exists, return the current list of addresses
      res.status(200).json({ message: 'Address already exists.', deliveryAdd: patient.deliveryAdd });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.checkout = async (req, res) => {
  try {
    const { deliveryAddress, paymentMethod } = req.body;
    const username = req.session.user.username;
    const patient = await Patient.findOne({ username });
    const totalAmount = calculateTotalAmount(patient.shoppingCart);

    // Check if the payment method is "wallet"
    if (paymentMethod === 'wallet') {
      // Check if the patient has sufficient balance in the wallet
      if (patient.wallet >= totalAmount) {
        patient.wallet -= totalAmount;
      } else {
        return res.status(400).json({ message: 'Insufficient funds in the wallet' });
      }
    } else if (paymentMethod === 'creditCard') {
      const order = new Order({
        username: username,
        shoppingCart: patient.shoppingCart,
        deliveryAdd: deliveryAddress,
        paymentMethod: paymentMethod,
        status: 'pending payment',
        orderDate: new Date(), // Set the order date to the current date and time
      });
      await order.save();
      // Create a Stripe Checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: patient.shoppingCart.map(item => {
          return {
            price_data: {
              currency: 'usd',
              product_data: {
                name: item.medicineName,
              },
              unit_amount: item.medicinePrice * 100,
            },
            quantity: item.quantity,
          }
        }),
        success_url: `http://localhost:3001/patient/success`,
        cancel_url: `http://localhost:3001/patient/failure`,
      });

      // Redirect to the Stripe Checkout page
      return res.json({ sessionId: session.id, url: session.url });
    }

    // Create a new order in the database
    const order = new Order({
      username: username,
      shoppingCart: patient.shoppingCart,
      deliveryAdd: deliveryAddress,
      paymentMethod: paymentMethod,
      orderDate: new Date(), // Set the order date to the current date and time
    });
    await order.save();

    // Update medicine quantities based on the items in the order
    for (const item of order.shoppingCart) {
      const medicine = await Medicine.findOne({ name: item.medicineName });

      if (medicine) {
        // Adjust the medicine quantity (subtract the quantity in the order)
        medicine.quantity -= parseInt(item.quantity, 10);
        medicine.sales = parseInt(medicine.sales, 10) + parseInt(item.quantity, 10);

        // Save the updated medicine
        await medicine.save();

        // Check if the medicine quantity is zero
        if (medicine.quantity === 0) {
          const pharmacists = await Pharmacist.find({ /* Add appropriate conditions to identify pharmacists */ });

          // Add a message to the notifications model
          const notificationMessage = `Medicine "${medicine.name}" is out of stock.`;
          await addNotification(notificationMessage);

          for (const pharmacist of pharmacists) {
            const pharmacistEmail = pharmacist.email;
            const medicineName = medicine.name;
            await sendOutOfStockEmail(pharmacistEmail, medicineName);
          }
        }
      } else {
        console.error(`Medicine not found: ${item.medicineName}`);
      }
    }

    // Clear the patient's shopping cart
    patient.shoppingCart = [];
    await patient.save();

    res.status(201).json({ message: 'Order placed successfully!', orderId: order._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Helper function to add a notification message to the notifications model
const addNotification = async (message) => {
  try {
    const newNotification = new Notification({
      message,
    });
    await newNotification.save();
  } catch (error) {
    console.error('Error adding notification:', error);
  }
};

// Helper function to calculate the total amount from the shopping cart
const calculateTotalAmount = (shoppingCart) => {
  return shoppingCart.reduce((total, item) => total + item.medicinePrice * item.quantity, 0);
};

const calculateTotalRefundAmount = async (shoppingCart) => {
  try {
    let total = 0;

    for (const item of shoppingCart) {
      const medicine = await Medicine.findOne({ name: item.medicineName });

      if (medicine) {
        const price = parseFloat(medicine.price);

        total += price * item.quantity;
      } else {
        console.error(`Medicine not found: ${item.medicineName}`);
      }
    }

    return total;
  } catch (error) {
    console.error('Error calculating total amount:', error);
    throw error;
  }
};

exports.emptyCart = async (req, res) => {
  const username = req.session.user.username;
  const patient = await Patient.findOne({ username });

  for (const item of patient.shoppingCart) {
    const medicine = await Medicine.findOne({ name: item.medicineName });

    if (medicine) {
      // Adjust the medicine quantity (subtract the quantity in the order)
      medicine.quantity -= parseInt(item.quantity, 10);
      medicine.sales = parseInt(medicine.sales, 10) + parseInt(item.quantity, 10);

      // Save the updated medicine
      await medicine.save();
    } else {
      console.error(`Medicine not found: ${item.medicineName}`);
    }
  }

  const order = await Order.findOneAndUpdate(
    { username: username, shoppingCart: { $eq: patient.shoppingCart }, status: 'pending payment' },
    { $set: { status: 'placed' } },
    { new: true } // Return the updated document
  );
  
  patient.shoppingCart = [];
  await patient.save();
  res.status(200).json({ message: 'Shopping cart emptied successfully', orderId: order._id });
};

exports.failedOrder = async (req, res) => {
  const username = req.session.user.username;
  const patient = await Patient.findOne({ username });

  const order = await Order.findOneAndUpdate(
    { username: username, shoppingCart: { $eq: patient.shoppingCart }, status: 'pending payment' },
    { $set: { status: 'payment failed' } },
    { new: true } // Return the updated document
  );
  
  res.status(200);
};

exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    const order = await Order.findOneAndUpdate(
      { _id: orderId},
      { $set: { status: 'canceled' } },
      { new: true } // Return the updated document
    );
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the payment method is not cash on delivery
    if (order.paymentMethod != 'cashOnDelivery') {
      // Refund amount to the wallet
      const patient = await Patient.findOne({ username: order.username });
      const totalAmount = await calculateTotalRefundAmount(order.shoppingCart);
      patient.wallet += totalAmount;
      await patient.save();
    }

    for (const item of order.shoppingCart) {
      const medicine = await Medicine.findOne({ name: item.medicineName });
  
      if (medicine) {
        medicine.quantity = parseInt(medicine.quantity, 10) + parseInt(item.quantity, 10);
        medicine.sales = parseInt(medicine.sales, 10) - parseInt(item.quantity, 10);
  
        // Save the updated medicine
        await medicine.save();
      } else {
        console.error(`Medicine not found: ${item.medicineName}`);
      }
    }

    res.status(200).json({ message: 'Order canceled', orderId: order._id  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.viewWalletAmount = async (req, res) => {
  try {
    const username = req.session.user.username;

    const patient = await Patient.findOne({ username });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const walletAmount = patient.wallet;
    res.status(200).json({ walletAmount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getsuccessPage = (req, res) => {
  res.render('patient/success', { message: null });
};

exports.getfailurePage = (req, res) => {
  res.render('patient/failure', { message: null });
};

exports.changePasswordPage = (req, res) => {
  res.render('patient/change-password', { message: null });
};

exports.resetPasswordPage = (req, res) => {
  res.render('patient/resetPassword', { message: null });
};

exports.home = async (req, res) => {
  try {
    const walletAmount = req.session.user.wallet;

    res.render('patient/patientHome', { walletAmount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.chat = (req, res) => {
  const patientUsername = req.session.user.username;

  res.render('patient/chat', { patientUsername });

  const socket = io('http://localhost:8000');

  socket.on('connect', () => {
    console.log('Connected to Socket.io server');
    socket.emit('join', { username: patientUsername, userType: 'patient' });
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from Socket.io server');
  });

  socket.on('chat message', (msg) => {
    console.log('Received message:', msg);
  });
};

exports.getAlternativeMedicines = async (req, res) => {
  try {
    const { medicineName } = req.query;

    if (!medicineName) {
      return res.status(400).json({ error: 'Medicine name is missing.' });
    }

    const medicine = await Medicine.findOne({ name: medicineName });
    
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found.' });
    }

    const medUse = medicine.medUse;

    const alternatives = await Medicine.find({
      medUse: medUse,
      name: { $ne: medicineName },
      quantity: { $gt: 0 },
    });

    res.json({ medicineName, alternatives });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.handleFileUpload = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    if (file.mimetype !== 'text/plain') {
      return res.status(400).json({ error: 'Invalid file type. Please upload a TXT file.' });
    }

    const content = file.buffer.toString('utf-8');
    const lines = content.split('\n');

    // Find the line that starts with "Date: "
    const dateLine = lines.find(line => line.startsWith('Date: '));

    if (!dateLine) {
      return res.status(400).json({ error: 'Invalid file format. Date not found.' });
    }

    const fileDate = moment(dateLine.replace('Date: ', ''), 'YYYY-MM-DD');
    const aWeekBeforeToday = moment().startOf('day').subtract(1, 'week');

    if (fileDate.isBetween(aWeekBeforeToday, moment().startOf('day'))) {
      const medicineNames = lines.map(line => line.trim());

      const searchResults = await Promise.all(
        medicineNames.map(async (medicineName) => {
          const medicine = await Medicine.findOne({ name: medicineName });
          const price = medicine ? medicine.price : 0;
      
          return { medicineName, result: medicine, price };
        })
      );
      
      res.json({ searchResults });
    } else {
      res.status(400).json({ error: 'Outdated file. Date is not within a week before today.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.presMed = (req, res) => {
  res.render('patient/presMed');
};