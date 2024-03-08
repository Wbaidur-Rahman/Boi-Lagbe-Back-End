const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/people');

// function getLogin(req, res, next) {
//     res.send('Response from login controller');
// }

// do login
async function login(req, res) {
    try {
        const user = await User.findOne({ email: req.body.email });
        let isValidPassword = false;

        if (user && user._id) {
            isValidPassword = await bcrypt.compare(req.body.password, user.password);
            console.log(isValidPassword);
        } else {
            throw createError('Login failed! Wrong email.');
        }

        if (isValidPassword) {
            //  prepare the user object to generate token
            const userObject = {
                username: user.name,
                email: user.email,
                role: 'user',
            };
            //  generate token
            const token = jwt.sign(userObject, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRY,
            });
            // set cookie
            res.cookie(process.env.COOKIE_NAME, token, {
                maxAge: process.env.JWT_EXPIRY,
                httpOnly: true,
                signed: true,
            });

            const cookie = {
                name: process.env.COOKIE_NAME,
                token,
                maxAge: process.env.JWT_EXPIRY,
            };

            res.status(200).json({
                msg: 'Login Successful',
                userObject,
                cookie,
            });
        } else {
            throw createError('Login failed! Wrong Password.');
        }
    } catch (error) {
        res.status(500).json({
            data: {
                email: req.body.email,
            },
            errors: {
                common: {
                    msg: error.message,
                },
            },
        });
    }
}

module.exports = {
    // getLogin,
    login,
};
