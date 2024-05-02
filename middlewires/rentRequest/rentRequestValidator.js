const { check, validationResult } = require('express-validator');
// const createError = require('http-errors');

// Validation rules for creating a new book
const addRentRequestValidators = [
    check('title').trim().notEmpty().withMessage('Title is required'),

    check('ownerid').notEmpty().withMessage('Ownerid is required'),

    check('bookid').notEmpty().withMessage('Bookid is required'),

    check('borrowerid').notEmpty().withMessage('Borrowerid is required'),

    check('duration').notEmpty().withMessage('Duration is required'),

    check('amount').notEmpty().withMessage('Amount is required'),

    check('borrowerphone')
        .isMobilePhone('bn-BD', {
            strictMode: false,
        })
        .withMessage('Mobile number must be a valid Bangladeshi mobile number'),
];

const addRentRequestValidationHandler = (req, res, next) => {
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
        // response the errors
        res.status(400).json({
            errors: mappedErrors,
        });
    }
};

module.exports = {
    addRentRequestValidators,
    addRentRequestValidationHandler,
};
