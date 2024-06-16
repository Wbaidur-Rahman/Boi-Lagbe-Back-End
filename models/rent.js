const mongoose = require('mongoose');

const rentSchema = mongoose.Schema(
    {
        borrowerid: {
            type: String,
            required: true,
            trim: true,
        },
        borrower_name: {
            type: String,
        },
        borrowerphone: {
            type: String,
            required: true,
        },
        borrower_email: {
            type: String,
        },
        borrower_address: {
            type: String,
            required: true,
        },
        ownerid: {
            type: String,
            required: true,
            trim: true,
        },
        owner_name: {
            type: String,
        },
        ownerphone: {
            type: String,
            required: true,
        },
        owner_email: {
            type: String,
        },
        owner_address: {
            type: String,
            required: true,
        },
        bookid: {
            type: String,
            required: true,
        },
        booktitle: {
            type: String,
            required: true,
        },
        startdate: {
            type: String,
            required: true,
        },
        enddate: {
            type: String,
            required: true,
        },
        cost: {
            type: String,
            required: true,
        },
        duration: {
            type: String,
        },
        agentid: {
            type: String,
            required: true,
        },
        notified: {
            type: Boolean,
            default: false,
        },
        payment_status: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Rent = mongoose.model('Rent', rentSchema);

module.exports = Rent;
