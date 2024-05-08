const Book = require('../models/book');

// get overall review
async function getRating(req, res) {
    const calculateOverallRating = (reviews) => {
        if (reviews.length === 0) {
            return 0; // If there are no reviews, return 0
        }

        let totalRating = 0;

        reviews.forEach((review) => {
            if (review.rating) {
                totalRating += Number(review.rating); // Assuming review.rating is a number
            }
        });

        const overallRating = totalRating / reviews.length;

        return overallRating.toFixed(1); // Return the overall rating rounded to 1 decimal place
    };

    try {
        const book = await Book.findOne({ _id: req.query.id });
        const rating = calculateOverallRating(book.reviews);

        res.status(200).json({
            rating,
            reviews: book.reviews,
        });
    } catch (error) {
        console.log('Error is :', error);
        res.status(500).json({
            errors: {
                common: {
                    msg: error.message,
                },
            },
        });
    }
}

// add review
async function addReview(req, res) {
    const review = req.body;

    // save Book or send error
    try {
        const book = await Book.findOne({ _id: review.bookid });

        if (book) {
            book.reviews.push(review.body);
        }

        // Save the user document
        await book.save();

        res.status(200).json({
            msg: 'Review was added successfully',
        });
    } catch (err) {
        console.log(err); // here I have a console.log()
        res.status(500).json({
            errors: {
                common: {
                    msg: 'Unknown error occurred',
                },
            },
        });
    }
}

module.exports = {
    addReview,
    getRating,
};
