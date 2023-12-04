const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    shoppingCart: [
        {
            medicineName: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
        },
    ],
    deliveryAdd: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "placed",
    },
    orderDate: {
        type: Date,
        default: () => new Date().toISOString().split('T')[0],
    },
});

module.exports = mongoose.model('Order', orderSchema);
