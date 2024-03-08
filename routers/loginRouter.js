const express = require('express');

const { login } = require('../controllers/loginController');
const {
    doLoginValidators,
    doLoginValidationHandler,
} = require('../middlewires/login/loginValidator');

const router = express.Router();

// login page
router.post('/', doLoginValidators, doLoginValidationHandler, login);

module.exports = router;
