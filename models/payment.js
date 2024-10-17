const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema(
    {
        tranid: {
            type: String,
            required: true,
        },
        amount: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
