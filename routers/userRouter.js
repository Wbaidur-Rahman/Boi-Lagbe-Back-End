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

const router = express.Router();

router.get('/', addUserIdValidator, addUserIdValidationHandler, getUser);

router.get('/avatar/:avatar', getUserAvatar);

router.post('/', avatarUpload, addUserValidators, addUserValidationHandler, addUser);

router.put('/:id', avatarUpload, updateUserValidators, updateUserValidationHandler, updateUser);

router.delete('/:id', removeUser);
module.exports = router;
