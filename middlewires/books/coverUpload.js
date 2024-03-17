const uploader = require('../../utilities/singleUploader');

function bookCoverUpload(req, res, next) {
    const upload = uploader(
        'book-covers',
        ['image/jpeg', 'image/jpg', 'image/png'],
        1000000,

        'Only .jpg, .jpeg or .png format less then 1MB allowed!'
    );

    // call the middlewre function
    upload.any()(req, res, (err) => {
        if (err) {
            res.status(500).json({
                errors: {
                    bookCover: {
                        msg: err.message,
                    },
                },
            });
        } else {
            next();
        }
    });
}

module.exports = bookCoverUpload;
