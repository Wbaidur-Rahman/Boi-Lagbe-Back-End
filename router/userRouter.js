const express = require('express');

const { getUser } = require('../controllers/userController');

const router = express.Router();

// login page
router.get('/', getUser);

module.exports = router;
