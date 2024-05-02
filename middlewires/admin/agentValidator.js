const { check, validationResult } = require('express-validator');

// for adding user purpose
const agentValidators = [
    check('email').isEmail().withMessage('Invalid email address'),

    check('mobile')
        .isMobilePhone('bn-BD', {
            strictMode: false,
        })
        .withMessage('Mobile number must be a valid Bangladeshi mobile number'),
];

const agentValidationHandler = (req, res, next) => {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();

    /* Now error structue is
        err: {
            name,
            email
        }
    */
    if (Object.keys(mappedErrors).length === 0) {
        console.log('Hello from agent validator');
        next();
    } else {
        console.log(req.body);
        // response the errors
        res.status(500).json({
            errors: mappedErrors,
        });
    }
};

module.exports = {
    agentValidators,
    agentValidationHandler,
};
