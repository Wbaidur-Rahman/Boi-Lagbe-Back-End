const express = require('express');

const { getUser, addUser, removeUser } = require('../controllers/userController');
const avatarUpload = require('../middlewires/users/avatarUpload');
const {
    addUserValidators,
    addUserValidationHandler,
} = require('../middlewires/users/userValidator');

const router = express.Router();

router.get('/', getUser);

router.post('/', avatarUpload, addUserValidators, addUserValidationHandler, addUser);

router.delete('/:id', removeUser);
module.exports = router;
