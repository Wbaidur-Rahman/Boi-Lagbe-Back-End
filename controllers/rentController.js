// const bcrypt = require('bcrypt');
// const path = require('path');
// const { unlink } = require('fs');
// const createError = require('http-errors');

const Rent = require('../models/rent');
const User = require('../models/people');
const Book = require('../models/book');
const RentRequest = require('../models/rentrequest');

// get a rent
async function getRent(req, res) {
    try {
        const rent = await Rent.findOne({ _id: req.query.id });

        if (rent && rent._id) {
            res.status(200).json({
                rent,
            });
        } else {
            res.status(404).json({
                errors: {
                    common: {
                        msg: 'No rent found',
                    },
                },
            });
        }
    } catch (error) {
        res.status(500).json({
            errors: {
                common: {
                    msg: error.message,
                },
            },
        });
    }
}

// deleting the rent requests for the rented book
async function deleteRentReqs(rentreqid, rent, dels) {
    try {
        const rentreq = await RentRequest.findOne({ _id: rentreqid });
        if (rentreq.bookid === rent.bookid) {
            await RentRequest.findByIdAndDelete({ _id: rentreqid });
            dels.push(rentreqid);
            // here the del array is not updated
        }
    } catch (error) {
        console.log(error.response.data);
    }
}

// purpose is to add rentinfo to db
async function addRent(req, res) {
    const rent = new Rent({
        ...req.body,
    });

    // save rent info or send error
    try {
        const agent = await User.findOne({ _id: rent.agentid });
        const book = await Book.findOne({ _id: rent.bookid });
        const borrower = await User.findOne({ _id: rent.borrowerid });
        const owner = await User.findOne({ _id: rent.ownerid });

        if (!agent || !book || !borrower || !owner) {
            res.status(404).json({
                errors: {
                    common: {
                        msg: 'Agent or Owner or Borrower or owner not found',
                    },
                },
            });
            return;
        }

        // the book is now not available so update the tag of the book
        const index = await book.tags.findIndex((tag) => tag.ownerid === rent.ownerid);

        if (index !== -1) {
            // Modify the tag at the found index
            book.tags[index].isAvailable = false;
        } else {
            // Tag not found
            console.log('Tag not found');
        }

        const dels = [];

        // delete the rent requests on user for the rented book
        for (const rentreqid of owner.rentrequests) {
            await deleteRentReqs(rentreqid, rent, dels);
        }

        // Filter out the values of dels array from owner.rentrequests
        owner.rentrequests = await owner.rentrequests.filter(
            (rentreqid) => !dels.includes(rentreqid)
        );

        await owner.save();

        // add the book to borrower rentbooks list
        borrower.rentbooks.push(rent.bookid);

        await borrower.save();

        // add the rent to an agent
        agent.rents.push(rent._id);

        // adding owner info to rent
        rent.owner_name = owner.name;
        rent.owner_email = owner.email;
        rent.owner_address = owner.address;

        // saving the rent info
        await rent.save();

        // saving the book
        await book.save();

        // updating the agent
        await agent.save();

        res.status(200).json({
            msg: 'Book rent successful',
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            errors: {
                common: {
                    msg: 'Unknown error occured when saving to db',
                },
            },
        });
    }
}

// remove Rent
async function removeRent(req, res) {
    try {
        const rent = await Rent.findByIdAndDelete({
            _id: req.params.id,
        });

        // removing the rent from agent
        let user = await User.findOne({ _id: rent.agentid });

        user.rents = await user.rents.filter((id) => id !== req.params.id);
        await user.save();

        // removing the book from borrower rentbooks list
        user = await User.findOne({ _id: rent.borrowerid });

        user.rentbooks = await user.rentbooks.filter((id) => id !== rent.bookid);
        await user.save();

        const book = await Book.findOne({ _id: rent.bookid });

        // the book is now available so update the tag of the book
        const index = await book.tags.findIndex((tag) => tag.ownerid === rent.ownerid);

        if (index !== -1) {
            // Modify the tag at the found index
            book.tags[index].isAvailable = true;
        } else {
            // Tag not found
            console.log('Tag not found');
        }

        await book.save();

        res.status(200).json({
            msg: 'Rent was removed successfully',
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            errors: {
                common: {
                    msg: 'Could not delete the user!',
                },
            },
        });
    }
}

// update Rent
async function updateRent(req, res) {
    try {
        const rent = await Rent.findOne({ _id: req.params.id });
        rent.notified = true;
        await rent.save();

        res.status(200).json({
            msg: 'Rent updated successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: {
                common: {
                    msg: 'Could not update the rent',
                },
            },
        });
    }
}

module.exports = {
    getRent,
    addRent,
    removeRent,
    updateRent,
};
