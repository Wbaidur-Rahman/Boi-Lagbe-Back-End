const bcrypt = require('bcrypt');
const path = require('path');
const { unlink } = require('fs');

const User = require('../models/people');

async function getUser(req, res) {
    const user = await User.find({ email: req.body.email });
    console.log(user);
    res.send(user);
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
    getUser,
    addUser,
    removeUser,
};
