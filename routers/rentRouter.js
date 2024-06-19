const express = require('express');

const { getRent, addRent, removeCancelledRent } = require('../controllers/rentController');
const { removeRent, updateRent } = require('../controllers/rentController');

const {
    addRentValidators,
    addRentValidationHandler,
} = require('../middlewires/rent/rentValidator');

const router = express.Router();

router.get('/', getRent);

router.post('/', addRentValidators, addRentValidationHandler, addRent);
router.post('/removecancelled', removeCancelledRent)

router.put('/:id', updateRent);

router.delete('/:id', removeRent);

module.exports = router;
