const express = require('express');

const {
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

router.delete('/:id', removeRentRequest);

module.exports = router;
