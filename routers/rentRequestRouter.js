const express = require('express');

const {
    acceptRentRequest,
    cancelRentRequest,
    getRentRequest,
    addRentRequest,
    removeRentRequest,
} = require('../controllers/rentRequestController');
const {
    addRentRequestValidators,
    addRentRequestValidationHandler,
} = require('../middlewires/rentRequest/rentRequestValidator');

const router = express.Router();

// login page
router.get('/', getRentRequest);

router.post('/', addRentRequestValidators, addRentRequestValidationHandler, addRentRequest);
router.post('/accept', acceptRentRequest);
router.post('/cancel', cancelRentRequest);

router.delete('/:id', removeRentRequest);

module.exports = router;
