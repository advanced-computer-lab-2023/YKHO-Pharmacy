const Medicine = require('../model/medicine');
const Patient = require('../model/patient');
const Order = require('../model/order');

exports.getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.render('patient/medicines', { medicines });
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

    if (oldPassword !== patient.password) {
      return res.status(401).json({ message: 'Incorrect old password' });
    }

    patient.password = newPassword;
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

    patient.password = newPassword;
    await patient.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { medicineName, medicinePrice } = req.body;
    const username = req.session.user.username;

    const patient = await Patient.findOne({ username });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const cartItem = patient.shoppingCart.find(item => item.medicineName === medicineName);

    if (!cartItem) {
      patient.shoppingCart.push({ medicineName, quantity: 1, medicinePrice });
    } else {
      cartItem.quantity += 1;
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

    res.render('patient/shoppingCart', { shoppingCart });
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

    res.render('patient/checkout', { deliveryAdd, shoppingCart });
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

      // Return the updated list of addresses
      res.redirect('/patient/checkout');
    } else {
      // Address already exists, return the current list of addresses
      res.status(200).json({ message: 'Address already exists.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.checkout = async (req, res) => {
  try {
    const { deliveryAddress, paymentMethod } = req.body;

    // Check if the delivery address is already stored in the patient's profile
    const username = req.session.user.username;

    const patient = await Patient.findOne({ username });

    const addressExists = patient.deliveryAdd.some((address) => address.address === deliveryAddress);

    // If the address is not stored, add it
    if (!addressExists) {
      patient.deliveryAdd.push({ address: deliveryAddress });
      await patient.save();
    }

    // Create a new order in the database
    const order = new Order({
      username: username,
      shoppingCart: patient.shoppingCart,
      deliveryAdd: deliveryAddress,
      paymentMethod: paymentMethod,
    });

    // Save the order to the database
    await order.save();

    // TODO: Implement payment processing with Stripe or other payment gateway

    // TODO: Update inventory and perform other necessary operations

    // Clear the patient's shopping cart (assuming you have a cart model)
    // ClearPatientCartFunction(req.patient._id);

    res.status(201).json({ message: 'Order placed successfully!', orderId: order._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.changePasswordPage = (req, res) => {
  res.render('patient/change-password', { message: null });
};

exports.resetPasswordPage = (req, res) => {
  res.render('patient/resetPassword', { message: null });
};

exports.home = async (req, res) => {
  res.render('patient/patientHome');
};