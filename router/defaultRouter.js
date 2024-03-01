const express = require('express');

const { getDefault } = require('../controllers/defaultController');

const router = express.Router();

// login page
router.get('/', getDefault);

module.exports = router;
