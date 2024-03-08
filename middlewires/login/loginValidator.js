const { check, validationResult } = require('express-validator');

const doLoginValidators = [
    check('email').isEmail().withMessage('Invalid Email'),
    check('password').isLength({ min: 1 }).withMessage('Password is required'),
];

const doLoginValidationHandler = (req, res, next) => {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();

    if (Object.keys(mappedErrors).length === 0) {
        next();
    } else {
        res.status(500).json({
            data: {
                email: req.body.email,
            },
            errors: mappedErrors,
        });
    }
};
module.exports = {
    doLoginValidators,
    doLoginValidationHandler,
};
