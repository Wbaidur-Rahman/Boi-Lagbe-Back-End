const express = require('express');

const { getBook } = require('../controllers/bookController');

const router = express.Router();

// login page
router.get('/', getBook);

module.exports = router;
