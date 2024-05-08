const express = require('express');

const { getRating, addReview } = require('../controllers/reviewController');

const router = express.Router();

router.get('/', getRating);

router.post('/', addReview);

// router.delete('/:id', removeReview);

module.exports = router;
