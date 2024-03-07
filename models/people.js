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
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user',
        },
    },
    {
        timestamos: true,
    }
);

const People = mongoose.model('People', peopleSchema);

module.exports = People;
