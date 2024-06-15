// const bcrypt = require('bcrypt');
const path = require('path');
const { unlink } = require('fs');
// const createError = require('http-errors');

const Book = require('../models/book');
const User = require('../models/people');

//  getBooks by Latest
async function getBooksOnLatest(req, res) {
    try {
        const bookIds = await Book.find().sort({ createdAt: -1 }).limit(15);

        res.status(200).json({ bookIds });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: {
                common: {
                    msg: error.message,
                },
            },
        });
    }
}
//  getBooks by Category
async function getBooksOnCategory(req, res) {
    const { category } = req.params;
    try {
        const bookIds = await Book.find({ 'data.category': category }).select('_id');

        res.status(200).json({ bookIds });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: {
                common: {
                    msg: error.message,
                },
            },
        });
    }
}

async function getBooksOnSearch(req, res) {
    const { searchString } = req.params;
    try {
        // Constructing the regular expression for search
        const regex = new RegExp(searchString, 'i'); // "i" flag for case-insensitive search

        const bookIds = await Book.find({
            $or: [{ title: { $regex: regex } }, { 'data.author': { $regex: regex } }],
        }).select('_id');

        res.status(200).json({ bookIds });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: {
                common: {
                    msg: error.message,
                },
            },
        });
    }
}

// get an Book
async function getBook(req, res) {
    try {
        const book = await Book.findOne({ _id: req.query.id });

        if (book) {
            res.status(200).json({
                book,
            });
        } else {
            // throw createError('Unknown error while reading data');
            res.status(404).json({
                errors: {
                    common: {
                        msg: 'No Book found',
                    },
                },
            });
        }
    } catch (error) {
        // console.log('Error is :', error);
        res.status(500).json({
            errors: {
                common: {
                    msg: error.message,
                },
            },
        });
    }
}

// here i want to add getBookCover func
function getBookCover(req, res) {
    const { coverImage } = req.params;
    try {
        const coverImagePath = path.join(
            __dirname,
            '..',
            'public',
            'uploads',
            'book-covers',
            coverImage
        );
        res.sendFile(coverImagePath);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
}

// add Book
async function addBook(req, res) {
    // here at first i should find out wheather the book is already in db or not
    let book = await Book.findOne({
        title: { $regex: new RegExp(req.body.title, 'i') },
        'data.author': { $regex: new RegExp(req.body.data.author, 'i') },
    });

    // if the book is not in database
    if (!book) {
        book = new Book({
            ...req.body,
            cover: req.files[0].filename,
        });
    }

    // now add the tag for ownerid and availability in tags array
    if (!book.tags) {
        book.tags = [];
    }
    book.tags.push({ ownerid: req.body.ownerid, isAvailable: true });

    // save Book or send error
    try {
        await book.save();

        // Find the user based on ownerid
        const user = await User.findOne({ _id: req.body.ownerid });

        // Push the new book ID into the books array of the user
        user.books.push(book._id);

        // Save the user document
        await user.save();

        res.status(200).json({
            msg: 'Book was added successfully',
        });
    } catch (err) {
        console.log(err); // here I have a console.log()
        if (book.cover) {
            // call unlink
            unlink(path.join(__dirname, `../public/uploads/book-covers/${book.cover}`), (err1) => {
                if (err1) console.log(err1);
            });
        }
        res.status(500).json({
            errors: {
                common: {
                    msg: 'Unknown error occurred',
                },
            },
        });
    }
}

// remove Book should be updated
async function removeBook(req, res) {
    try {
        const { userid } = req.params;
        const { bookid } = req.params;

        const book = await Book.findOne({
            _id: bookid,
        });

        if (book.tags.length >= 1) {
            book.tags = book.tags.filter((tag) => tag.ownerid !== userid);
            await book.save();

            res.status(200).json({
                msg: 'Book tag removed',
            });
        } else {
            await Book.findByIdAndDelete({
                _id: bookid,
            });

            // remove Book avatar if any
            if (book && book.cover) {
                // call unlink
                unlink(
                    path.join(__dirname, `../public/uploads/book-covers/${book.cover}`),
                    (err) => {
                        if (err) console.log(err);
                    }
                );
            }
            res.status(200).json({
                msg: 'Book was removed successfully',
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            errors: {
                common: {
                    msg: 'Could not delete the Book!',
                },
            },
        });
    }
}

// update a book
async function updateBook(req, res) {
    try {
        const book = await Book.findOne({
            _id: req.params.id,
        });

        book.isAvailable = req.body.isAvailable;

        await book.save();

        res.status(200).json({
            msg: 'Book was updated successfully',
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            errors: {
                common: {
                    msg: 'Could not updtae the Book!',
                },
            },
        });
    }
}

module.exports = {
    getBook,
    addBook,
    removeBook,
    getBookCover,
    getBooksOnCategory,
    getBooksOnSearch,
    updateBook,
    getBooksOnLatest,
};
