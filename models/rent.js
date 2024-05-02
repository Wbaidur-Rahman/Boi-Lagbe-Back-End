const mongoose = require('mongoose');

const rentSchema = mongoose.Schema(
    {
        borrowerid: {
            type: String,
            required: true,
            trim: true,
        },
        borrowerphone: {
            type: String,
            required: true,
        },
        ownerid: {
            type: String,
            required: true,
            trim: true,
        },
        ownerphone: {
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
    },
    {
        timestamps: true,
    }
);

const Rent = mongoose.model('Rent', rentSchema);

module.exports = Rent;
