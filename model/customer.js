const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    full_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "User",
        required: true
    },
    image: {
        type: String,
        default: null
    }
});

const Customer = mongoose.model('customers', customerSchema);

module.exports = Customer;