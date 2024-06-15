const { check, validationResult } = require('express-validator');
const validator = require('validator');
// const createError = require('http-errors');
const path = require('path');
const { unlink } = require('fs');

// const Book = require('../../models/people');

// const addBookIdValidator = [
//     query('id')
//         .isLength({
//             min: 24,
//             max: 24,
//         })
//         .withMessage('Invalid Book Id'),
// ];

// const addBookIdValidationHandler = (req, res, next) => {
//     const errors = validationResult(req);
//     const mappedErrors = errors.mapped();

//     if (Object.keys(mappedErrors).length === 0) {
//         next();
//     } else {
//         res.status(403).json({
//             errors: mappedErrors,
//         });
//     }
// };

// Validation rules for creating a new book
const addBookValidators = [
    check('title').trim().notEmpty().withMessage('Title is required'),

    check('cover')
        // .notEmpty()
        // .withMessage('Cover is required')
        .custom((value) => {
            if (!value) {
                // If cover is not provided, skip further validation
                return true;
            }

            // Extracting file extension
            const extension = path.extname(value);
            // Allowed extensions
            const allowedExtensions = ['.jpeg', '.jpg', '.png'];

            if (allowedExtensions.includes(extension.toLowerCase())) {
                return true;
            }
            throw new Error('Cover should be in JPEG, JPG, or PNG format');
        }),

    check('data.category')
        .optional()
        .toLowerCase()
        .isIn(['academic', 'poem', 'novel', 'gk', 'others'])
        .withMessage('Invalid category'),

    check('data.author').trim().notEmpty().withMessage('Author is required'),

    check('data.price')
        .notEmpty()
        .withMessage('Price is required')
        .isNumeric()
        .withMessage('Price should be a number'),

    check('data.genre').optional(),

    check('data.isbn')
        .optional()
        .custom((value) => {
            if (value !== 'null' && value !== 'undefined' && value !== '') {
                if (!validator.isISBN(value)) {
                    throw new Error('Invalid ISBN');
                }
            }
            return true; // Return true if validation succeeds
        }),

    check('data.pages').optional(),

    check('data.pagetype').optional(),

    check('ownerid').notEmpty().withMessage('Owner is required'),

    check('reviews').optional().isArray({ min: 0 }).withMessage('Reviews should be an array'),

    check('reviews.*.reviewer').optional(),

    check('reviews.*.comment').optional(),

    check('isAvailable').optional().isBoolean().withMessage('isAvailable should be a boolean'),
];

const addBookValidationHandler = (req, res, next) => {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();

    /* Now error structue is
        err: {
            name,
            email
        }
    */

    if (Object.keys(mappedErrors).length === 0) {
        next();
    } else {
        // remove uploaded files
        if (req.files && req.files.length > 0) {
            const { filename } = req.files[0];
            unlink(path.join(__dirname, `/../../public/uploads/book-covers/${filename}`), (err) => {
                if (err) console.log(err);
            });
        }

        // response the errors
        res.status(400).json({
            errors: mappedErrors,
        });
    }
};

module.exports = {
    addBookValidators,
    addBookValidationHandler,
    // addBookIdValidator,
    // addBookIdValidationHandler,
};
