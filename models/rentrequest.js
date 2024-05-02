const mongoose = require('mongoose');

const rentRequestSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        bookid: {
            type: String,
            required: true,
        },
        duration: {
            type: String,
            required: true,
        },
        borrowerid: {
            type: String,
            required: true,
        },
        borrowerphone: {
            type: String,
        },
        amount: {
            type: String,
            required: true,
        },
        ownerid: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const RentRequest = mongoose.model('RentRequest', rentRequestSchema);

module.exports = RentRequest;
