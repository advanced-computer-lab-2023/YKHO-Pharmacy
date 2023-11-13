const Medicine = require('../model/medicine');
const Patient = require('../model/patient');
const Order = require('../model/order');
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

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

    res.render('patient/shoppingCart', { shoppingCart });
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

    res.render('patient/orders', { orders });
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
    } else if (paymentMethod === 'creditCard'){
      const order = new Order({
        username: username,
        shoppingCart: patient.shoppingCart,
        deliveryAdd: deliveryAddress,
        paymentMethod: paymentMethod,
        status: 'pending payment'
      });
      await order.save();
      // Create a Stripe Checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: patient.shoppingCart.map(item => {
          return{
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
        success_url: `http://localhost:${process.env.PORT}/patient/success`,
        cancel_url: `http://localhost:${process.env.PORT}/patient/failure`,
      });

      // Redirect to the Stripe Checkout page
      return res.redirect(session.url);
    }
    // Create a new order in the database
    const order = new Order({
      username: username,
      shoppingCart: patient.shoppingCart,
      deliveryAdd: deliveryAddress,
      paymentMethod: paymentMethod,
    });
    await order.save();

    // Update medicine quantities based on the items in the order
    for (const item of order.shoppingCart) {
      const medicine = await Medicine.findOne({ name: item.medicineName });

      if (medicine) {
        // Adjust the medicine quantity (subtract the quantity in the order)
        medicine.quantity -= item.quantity;

        // Save the updated medicine
        await medicine.save();
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

// Helper function to calculate the total amount from the shopping cart
const calculateTotalAmount = (shoppingCart) => {
  return shoppingCart.reduce((total, item) => total + item.medicinePrice * item.quantity, 0);
};

exports.emptyCart = async (req, res) => {
  const username = req.session.user.username;
  const patient = await Patient.findOne({ username });

  for (const item of patient.shoppingCart) {
    const medicine = await Medicine.findOne({ name: item.medicineName });

    if (medicine) {
      // Adjust the medicine quantity (subtract the quantity in the order)
      medicine.quantity -= item.quantity;

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
  
  res.status(200).json({ message: 'Payment failed', orderId: order._id });
};

exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findOneAndUpdate(
      { _id : orderId },
      { $set: { status: 'canceled' } },
      { new: true } // Return the updated document
    );

    res.status(200).json({ message: 'Order canceled', orderId: order._id  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
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
  res.render('patient/patientHome');
};





// const PayByCredit = async (req, res) => {
  
//   const appoitmentid = req.params.id;
//   const appoitment = await appointmentModel.findone({ _id: appoitmentid }) - populate("doctorID");
  
//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'], 
//       mode: 'payment', 
//       line_items: [{
//         price_data: {
//           currency: 'usd',
//           product_data: {
//             name: "Appointment With Dr." + appoitment.doctorID.name,
//           },
//           unit_amount: appoitment.price * 100,
//         },
//         quantity: 1,
//       }],
//       success_url: `http://localhost:${process.env.PORT}/sucess`,
//       cancel_url: `https://localhost:${process.env.PORT}/fail`,
//   })
//   res.redirect(session.url);

//   }catch(e){
//     console.error(e);
//     res.status(500).send('Internal Server Error');
//   }
// }
