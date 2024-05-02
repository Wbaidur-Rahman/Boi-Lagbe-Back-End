const { check, validationResult } = require('express-validator');

// for adding rent purpose
const addRentValidators = [
    check('borrowerphone')
        .isMobilePhone('bn-BD', {
            strictMode: false,
        })
        .withMessage('Mobile number must be a valid Bangladeshi mobile number'),

    check('ownerphone')
        .isMobilePhone('bn-BD', {
            strictMode: false,
        })
        .withMessage('Mobile number must be a valid Bangladeshi mobile number'),

    check('borrowerid').notEmpty().withMessage('Borrowerid is required'),
    check('agentid').notEmpty().withMessage('Agentid is required'),
    check('bookid').notEmpty().withMessage('Bookid is required'),
    check('ownerid').notEmpty().withMessage('Ownerid is required'),
    check('booktitle').notEmpty().withMessage('Booktitle is required'),
    check('startdate').notEmpty().withMessage('Startdate is required'),
    check('enddate').notEmpty().withMessage('Enddate is required'),
    check('cost').notEmpty().withMessage('Cost is required'),
];

const addRentValidationHandler = (req, res, next) => {
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
        res.status(500).json({
            errors: mappedErrors,
        });
    }
};

module.exports = {
    addRentValidators,
    addRentValidationHandler,
};
