const bcrypt = require('bcrypt');
const path = require('path');
const { unlink } = require('fs');
// const createError = require('http-errors');

const User = require('../models/people');

// here i am writing getUserAvatar func
function getUserAvatar(req, res) {
    const { avatar } = req.params;
    try {
        const avatarImagePath = path.join(__dirname, '..', 'public', 'uploads', 'avatars', avatar);
        res.sendFile(avatarImagePath);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
}

// get an user
async function getUser(req, res) {
    try {
        const user = await User.findOne({ _id: req.query.id });

        if (user && user._id) {
            res.status(200).json({
                user,
            });
        } else {
            // throw createError('Unknown error while reading data');
            res.status(404).json({
                errors: {
                    common: {
                        msg: 'No user found',
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

// add user
async function addUser(req, res) {
    let newUser;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    if (req.files && req.files.length > 0) {
        newUser = new User({
            ...req.body,
            avatar: req.files[0].filename,
            password: hashedPassword,
        });
    } else {
        newUser = new User({
            ...req.body,
            password: hashedPassword,
        });
    }

    // save user or send error
    try {
        await newUser.save();
        res.status(200).json({
            msg: 'User was added successfully',
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            errors: {
                common: {
                    msg: 'Unknown error occured',
                },
            },
        });
    }
}

// update user
async function updateUser(req, res) {
    const { id } = req.params;

    try {
        const updatedUser = await User.findById(id);

        if (!updatedUser) {
            res.status(404).json({
                errors: {
                    common: {
                        msg: 'User not found',
                    },
                },
            });
        }

        // Update only the fields that are present in the request body
        if (req.body.name) {
            updatedUser.name = req.body.name;
        }
        if (req.files && req.files.length > 0) {
            updatedUser.avatar = req.files[0].filename;
        }
        // if (req.body.mobile) {
        //     updatedUser.mobile = req.body.mobile;
        // }
        if (req.body.address) {
            updatedUser.address = req.body.address;
        }
        if (req.body.password) {
            if (req.body.password.length < 20) {
                updatedUser.password = await bcrypt.hash(req.body.password, 10);
            } else updatedUser.password = req.body.password;
        }

        if (req.body.books) {
            updatedUser.books = req.body.books;
        }
        if (req.body.adcartbooks) {
            updatedUser.adcartbooks = req.body.adcartbooks;
        }
        if (req.body.rentbooks) {
            updatedUser.rentbooks = req.body.rentbooks;
        }

        // Save the updated user
        await updatedUser.save();

        res.status(200).json({
            msg: 'User updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: {
                common: {
                    msg: 'Could not update the user',
                },
            },
        });
    }
}

// remove user
async function removeUser(req, res) {
    try {
        const user = await User.findByIdAndDelete({
            _id: req.params.id,
        });

        // remove user avatar if any
        if (user.avatar) {
            // call unlink
            unlink(path.join(__dirname, `../public/uploads/avatars/${user.avatar}`), (err) => {
                if (err) console.log(err);
            });
        }
        res.status(200).json({
            msg: 'User was removed successfully',
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            errors: {
                common: {
                    msg: 'Could not delete the user!',
                },
            },
        });
    }
}

module.exports = {
    getUserAvatar,
    getUser,
    addUser,
    updateUser,
    removeUser,
};
