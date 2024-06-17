const mongoose = require('mongoose');

const bookSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        cover: {
            type: String,
            required: true,
        },
        data: {
            author: {
                type: String,
                required: true,
            },
            price: {
                type: String,
                required: true,
            },
            category: {
                type: String,
                enum: ['academic', 'poem', 'novel', 'gk', 'others'],
                default: 'others',
            },
            genre: {
                type: String,
            },
            isbn: {
                type: String,
            },
            pages: {
                type: String,
            },
            pagetype: {
                type: String,
            },
        },
        reviews: [
            {
                reviewer: {
                    type: String,
                },
                rating: {
                    type: String,
                },
                comment: {
                    type: String,
                },
            },
        ],
        tags: [
            {
                ownerid: {
                    type: String,
                    required: true,
                },
                isAvailable: {
                    type: Boolean,
                    default: true,
                },
                isStored: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
