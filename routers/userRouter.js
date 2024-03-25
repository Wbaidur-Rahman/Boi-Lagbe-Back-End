const express = require('express');

const {
    getUser,
    addUser,
    updateUser,
    removeUser,
    getUserAvatar,
} = require('../controllers/userController');
const avatarUpload = require('../middlewires/users/avatarUpload');
const {
    addUserValidators,
    addUserValidationHandler,
    addUserIdValidator,
    addUserIdValidationHandler,
    updateUserValidators,
    updateUserValidationHandler,
} = require('../middlewires/users/userValidator');

const authenticateUser = require('../middlewires/auth/authenticateUser');

const router = express.Router();

router.get('/logout', authenticateUser, (req, res) => {
    // try {
    //     req.logout((err) => {
    //         if (err) {
    //             return res.status(500).json({ message: 'Logout failed', error: err });
    //         }
    //         return res.redirect('/');
    //     });
    // } catch (error) {
    //     console.log(error);
    //     return res.status(500).json({ message: 'An error occurred during logout', error });
    // }
    res.cookie(process.env.COOKIE_NAME, '', {
        maxAge: 0,
        httpOnly: true,
    });
    res.end();
});

router.get('/', authenticateUser, addUserIdValidator, addUserIdValidationHandler, getUser);

router.get('/avatar/:avatar', authenticateUser, getUserAvatar);

router.post('/', avatarUpload, addUserValidators, addUserValidationHandler, addUser);

router.put('/:id', avatarUpload, updateUserValidators, updateUserValidationHandler, updateUser);

router.delete('/:id', removeUser);
module.exports = router;
