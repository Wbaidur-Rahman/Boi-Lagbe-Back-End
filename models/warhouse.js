const mongoose = require('mongoose');

const warhouseschema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        mobile: {
            type: String,
            required: true,
        },
        agents: [
            {
                type: String,
            },
        ],
        stored_books: [
            {
                type: String,
            },
        ],
        store_reqs: [
            {
                bookid: {
                    type: String,
                },
                title: {
                    type: String,
                },
                author: {
                    type: String,
                },
                ownerid: {
                    type: String,
                }, 
                owner: {
                    type: String,
                },
                address: {
                    type: String,
                },
                mobile: {
                    type: String,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Warhouse = mongoose.model('Warhouse', warhouseschema);

module.exports = Warhouse;
