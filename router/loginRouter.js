const express = require('express');

const { getLogin } = require('../controllers/loginController');

const router = express.Router();

// login page
router.get('/', getLogin);

module.exports = router;
