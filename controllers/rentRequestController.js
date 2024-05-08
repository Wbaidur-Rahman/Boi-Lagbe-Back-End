const User = require('../models/people');
const RentRequest = require('../models/rentrequest');

// get an RentRequest
async function getRentRequest(req, res) {
    try {
        const rentrequest = await RentRequest.findOne({ _id: req.query.id });

        if (rentrequest) {
            res.status(200).json({
                rentrequest,
            });
        } else {
            // throw createError('Unknown error while reading data');
            res.status(404).json({
                errors: {
                    common: {
                        msg: 'No rentrequest found',
                    },
                },
            });
        }
    } catch (error) {
        // console.log('Error is :', error);
        res.status(500).json({
            errors: {
                common: {
                    msg: error.message,
                },
            },
        });
    }
}

// add rentrequest
async function addRentRequest(req, res) {
    // here at first i should find out wheather the RentRequest is already in db or not
    let rentrequest = await RentRequest.findOne({
        borrowerid: req.body.borrowerid,
        bookid: req.body.bookid,
    });

    // if the RentRequest is not in database
    if (!rentrequest) {
        rentrequest = new RentRequest({
            ...req.body,
        });
    }

    rentrequest.duration = req.body.duration;
    rentrequest.amount = req.body.amount;
    rentrequest.borrowerphone = req.body.borrowerphone;

    // save Book or send error
    try {
        await rentrequest.save();

        // Find the user based on ownerid
        const user = await User.findOne({ _id: req.body.ownerid });

        if (!user.rentrequests) user.rentrequests = [];

        // Check if the rent request ID is already in the user's rent requests array
        if (!user.rentrequests.includes(rentrequest._id)) {
            // If not present, push it into the array
            user.rentrequests.push(rentrequest._id);
        }

        // Save the user document
        await user.save();

        // Find the user based on borrowerid
        const user1 = await User.findOne({ _id: req.body.borrowerid });

        if (!user1.sentreqs) user1.sentreqs = [];

        // Check if the rent request ID is already in the user1's rent requests array
        if (!user1.sentreqs.includes(rentrequest._id)) {
            // If not present, push it into the array
            user1.sentreqs.push(rentrequest._id);
        }

        // Save the user1 document
        await user1.save();

        res.status(200).json({
            msg: 'Rentrequest was added successfully',
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

// remove rentRequest
async function removeRentRequest(req, res) {
    try {
        const rentrequest = await RentRequest.findByIdAndDelete({
            _id: req.params.id,
        });

        const user = await User.findOne({ _id: rentrequest.ownerid });
        user.rentbooks = user.rentrequests.map(
            (rentrequestid) => rentrequestid !== rentrequest._id
        );
        await user.save();

        res.status(200).json({
            msg: 'RentRequest was removed successfully',
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            errors: {
                common: {
                    msg: 'Could not delete the RentRequest!',
                },
            },
        });
    }
}

module.exports = {
    getRentRequest,
    addRentRequest,
    removeRentRequest,
};
