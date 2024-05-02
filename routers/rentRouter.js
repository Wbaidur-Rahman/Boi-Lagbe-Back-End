const express = require('express');

const { getRent, addRent } = require('../controllers/rentController');
// const { updateRent, removeRent } = require('../controllers/rentController');

const {
    addRentValidators,
    addRentValidationHandler,
} = require('../middlewires/rent/rentValidator');

const router = express.Router();

router.get('/', getRent);

router.post('/', addRentValidators, addRentValidationHandler, addRent);

// router.put('/:id', updateRent);

// router.delete('/:id', removeRent);

module.exports = router;
