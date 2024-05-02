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

        console.log('dels : ====================================', dels);

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

        // saving the rent info
        await rent.save();

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

// update user
// async function updateUser(req, res) {
//     const { id } = req.params;

//     try {
//         const updatedUser = await User.findById(id);

//         if (!updatedUser) {
//             res.status(404).json({
//                 errors: {
//                     common: {
//                         msg: 'User not found',
//                     },
//                 },
//             });
//         }

//         // Update only the fields that are present in the request body
//         if (req.body.name) {
//             updatedUser.name = req.body.name;
//         }
//         if (req.files && req.files.length > 0) {
//             updatedUser.avatar = req.files[0].filename;
//         }
//         // if (req.body.mobile) {
//         //     updatedUser.mobile = req.body.mobile;
//         // }
//         if (req.body.address) {
//             updatedUser.address = req.body.address;
//         }
//         if (req.body.password) {
//             if (req.body.password.length < 20) {
//                 updatedUser.password = await bcrypt.hash(req.body.password, 10);
//             } else updatedUser.password = req.body.password;
//         }

//         if (req.body.books) {
//             updatedUser.books = req.body.books;
//         }
//         if (req.body.adcartbooks) {
//             updatedUser.adcartbooks = req.body.adcartbooks;
//         }
//         if (req.body.rentbooks) {
//             updatedUser.rentbooks = req.body.rentbooks;
//         }

//         // console.log(req.body);

//         // Save the updated user
//         await updatedUser.save();

//         res.status(200).json({
//             msg: 'User updated successfully',
//             user: updatedUser,
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             errors: {
//                 common: {
//                     msg: 'Could not update the user',
//                 },
//             },
//         });
//     }
// }

// remove user
// async function removeUser(req, res) {
//     try {
//         const user = await User.findByIdAndDelete({
//             _id: req.params.id,
//         });

//         // remove user avatar if any
//         if (user.avatar) {
//             // call unlink
//             unlink(path.join(__dirname, `../public/uploads/avatars/${user.avatar}`), (err) => {
//                 if (err) console.log(err);
//             });
//         }
//         res.status(200).json({
//             msg: 'User was removed successfully',
//         });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({
//             errors: {
//                 common: {
//                     msg: 'Could not delete the user!',
//                 },
//             },
//         });
//     }
// }

module.exports = {
    getRent,
    addRent,
};
