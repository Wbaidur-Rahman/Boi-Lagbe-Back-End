const express = require('express');

const { getUser, addUser } = require('../controllers/userController');
const avatarUpload = require('../middlewires/users/avatarUpload');
const {
    addUserValidators,
    addUserValidationHandler,
} = require('../middlewires/users/userValidator');

const router = express.Router();

// login page
router.get('/', getUser);

router.post('/', avatarUpload, addUserValidators, addUserValidationHandler, addUser);

module.exports = router;
