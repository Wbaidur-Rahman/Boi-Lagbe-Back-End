const mongoose = require('mongoose');

const peopleSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        mobile: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
        },
        address: {
            type: String,
            required: true,
        },
        books: [
            {
                type: String,
            },
        ],
        adcartbooks: [
            {
                type: String,
            },
        ],
        rentbooks: [
            {
                type: String,
            },
        ],
        role: {
            type: String,
            enum: ['admin', 'user', 'agent'],
            default: 'user',
        },
        rentrequests: [
            {
                type: String,
            },
        ],
        sentreqs: [
            {
                type: String,
            },
        ],
        notifications: [
            {
                type: String,
            },
        ],
        // for agent part
        rents: [
            {
                type: String,
            },
        ],
        collateral: {
            type: String,
            default: '0',
        },
    },
    {
        timestamps: true,
    }
);

const People = mongoose.model('People', peopleSchema);

module.exports = People;
