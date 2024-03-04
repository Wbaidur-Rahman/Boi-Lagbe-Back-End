const bcrypt = require('bcrypt');

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

    // console.log(newUser);

    // save user or send error
    try {
        await newUser.save();
        res.status(200).json({
            message: 'User was added successfully',
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

module.exports = {
    getUser,
    addUser,
};
