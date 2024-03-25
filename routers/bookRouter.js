const express = require('express');
const bookCoverUpload = require('../middlewires/books/coverUpload');

const {
    getBook,
    addBook,
    removeBook,
    getBookCover,
    getBooksOnCategory,
} = require('../controllers/bookController');
const {
    addBookValidators,
    addBookValidationHandler,
} = require('../middlewires/books/bookValidator');

const router = express.Router();

// login page
router.get('/', getBook);

router.get('/categories/:category', getBooksOnCategory);

router.get('/book-covers/:coverImage', getBookCover);

router.post('/', bookCoverUpload, addBookValidators, addBookValidationHandler, addBook);

router.delete('/:id', removeBook);

module.exports = router;
