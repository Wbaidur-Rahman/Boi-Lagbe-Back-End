const { check, validationResult } = require('express-validator');
const createError = require('http-errors');
const path = require('path');
const { unlink } = require('fs');

const User = require('../../models/people');

// const addUserIdValidator = [
//     query('id')
//         .isLength({
//             min: 24,
//             max: 24,
//         })
//         .withMessage('Invalid User Id'),
// ];

// const addUserIdValidationHandler = (req, res, next) => {
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

// for adding user purpose
const addUserValidators = [
    
    check('name')
        .isLength({ min: 1 })
        .withMessage('Name is required')
        .isAlpha('en-US', { ignore: ' -' })
        .withMessage('Name must not contain anything other than alphabet')
        .trim(),

    check('email')
        .isEmail()
        .withMessage('Invalid email address')
        .trim()
        .custom(async (value) => {
            try {
                const user = await User.findOne({ email: value });
                if (user) {
                    throw createError('Email already is in use!');
                }
            } catch (err) {
                // throw createError('Error finding email');
                throw createError(err.message);
            }
        }),

    check('mobile')
        .isMobilePhone('bn-BD', {
            strictMode: false,
        })
        .withMessage('Mobile number must be a valid Bangladeshi number')
        .custom(async (value) => {
            try {
                const user = await User.findOne({ mobile: value });
                if (user) {
                    throw createError('Mobile already is in use');
                }
            } catch (err) {
                throw createError(err.message);
            }
        }),

    check('address').notEmpty().withMessage('Address is required'),
    check('password')
        .isStrongPassword()
        .withMessage(
            'Password must be at least 8 characters long should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol'
        ),
];

const addUserValidationHandler = (req, res, next) => {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();

    console.log(req.body.mobile);

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
            unlink(path.join(__dirname, `/../../public/uploads/avatars/${filename}`), (err) => {
                if (err) console.log(err);
            });
        }

        // response the errors
        res.status(500).json({
            errors: mappedErrors,
        });
    }
};

// for updating user purpose
const updateUserValidators = [
    check('name')
        .isLength({ min: 1 })
        .withMessage('Name is required')
        .isAlpha('en-US', { ignore: ' -' })
        .withMessage('Name must not contain anything other than alphabet')
        .trim(),

    // check('mobile')
    //     .optional({ nullable: true })
    //     .isMobilePhone('bn-BD', {
    //         strictMode: false,
    //     })
    //     .withMessage('Mobile number must be a valid Bangladeshi mobile number')
    //     .custom(async (value) => {
    //         try {
    //             const user = await User.findOne({ mobile: value });
    //             if (user) {
    //                 throw createError('Mobile already is in use');
    //             }
    //         } catch (err) {
    //             throw createError(err.message);
    //         }
    //     }),

    check('address').notEmpty().withMessage('Address is required'),
    check('password')
        .isStrongPassword()
        .withMessage(
            'Password must be at least 8 characters long should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol'
        ),
];

const updateUserValidationHandler = (req, res, next) => {
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
            unlink(path.join(__dirname, `/../../public/uploads/avatars/${filename}`), (err) => {
                if (err) console.log(err);
            });
        }

        // response the errors
        res.status(500).json({
            errors: mappedErrors,
        });
    }
};

module.exports = {
    addUserValidators,
    addUserValidationHandler,
    // addUserIdValidator,
    // addUserIdValidationHandler,
    updateUserValidators,
    updateUserValidationHandler,
};
