const { check, validationResult } = require('express-validator');
// const createError = require('http-errors');

// Validation rules for creating a new book
const addNotificationValidators = [
    check('title').trim().notEmpty().withMessage('Title is required'),

    check('ownerid').notEmpty().withMessage('Ownerid is required'),

    check('message').notEmpty().withMessage('Message is required'),
];

const addNotificationValidationHandler = (req, res, next) => {
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
    addNotificationValidators,
    addNotificationValidationHandler,
};
