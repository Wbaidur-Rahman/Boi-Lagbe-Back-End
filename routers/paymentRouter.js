const express = require('express');

const router = express.Router();

const {paymentSuccess} = require('../controllers/paymentController');

router.post('/success', paymentSuccess);

module.exports = router;