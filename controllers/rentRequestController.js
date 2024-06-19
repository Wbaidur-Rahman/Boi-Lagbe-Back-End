const User = require('../models/people');
const RentRequest = require('../models/rentrequest');
const Book = require('../models/book');
const Rent = require('../models/rent');

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
     // process the rentrequest
     try {
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

        await rentrequest.save();

        // Find the user based on borrowerid to add the rentreq id in renrequests array
        const borrower = await User.findOne({ _id: req.body.borrowerid });

        if (!borrower.rentrequests) borrower.rentrequests = [];

        // Check if the rent request ID is already in the user's rent requests array
        if (!borrower.rentrequests.includes(rentrequest._id)) {
            // If not present push it into the array
            borrower.rentrequests.push(rentrequest._id);
        }
        // Save the user document
        await borrower.save();


        // Now the agent should get a rent info
        const owner = await User.findOne({_id: req.body.ownerid});
        // const book = await Book.findOne({_id: req.body.bookid});
        const agent = await User.findOne({_id: req.body.agentid});

        // here at first i should find out wheather the Rent is already in db or not
        let rent = await Rent.findOne({
            borrowerid: req.body.borrowerid,
            bookid: req.body.bookid,
        });

        // if the RentRequest is not in database
        if (!rent) {
            rent = new Rent({
                borrowerid: rentrequest.borrowerid,
                borrower_name: borrower.name,
                borrowerphone: rentrequest.borrowerphone,
                borrower_email: borrower.email,
                borrower_address: borrower.address,
                ownerid: rentrequest.ownerid,
                owner_name: owner.name,
                ownerphone: owner.mobile,
                owner_address: owner.address,
                bookid: rentrequest.bookid,
                booktitle: rentrequest.title,
                startdate: new Date().toISOString(),
                enddate: new Date(Date.now() + Number(rentrequest.duration)*24 * 3600000).toISOString(),
                cost: rentrequest.amount,
                duration: rentrequest.duration,
                status: "progress",
                agentid: agent._id,
            });
        } else {
            rent.status = "progress",
            rent.duration = rentrequest.duration;
            rent.amount = rentrequest.amount;
            rent.borrowerphone = rentrequest.borrowerphone;
        }


         // add the rent to the agent rents list
         if (!agent.rents) agent.rents = [];

        // Check if the rent ID is already in the agent rents array
        if (!agent.rents.includes(rent._id)) {
            // If not present, push it into the array
            agent.rents.push(rent._id);
        }
        // Save the user document
        await agent.save();

        // now save the rent info to database
        await rent.save();

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

// accepting a rent request
async function acceptRentRequest(req, res){
    const rentreq = req.body;
    // console.log(rentreq);
    try {
        // 6 tasks 1. delete rentreq 2. remove from borrower rentreqs arrray 3. add in borrower rents array 4. charge collateral 
        // 5. update status of the book in rent array 6. set isAvailable false for the book


        const borrower = await User.findOne({_id: rentreq.borrowerid})
        // 2. Removing rentreqs from borrower
        borrower.rentrequests = await borrower.rentrequests.filter((id) => id != rentreq._id);
        
        // 3. adding book to borrower rentbooks books list
        if(!borrower.rentbooks) borrower.rentbooks = [];
        if(!borrower.rentbooks.includes(rentreq.bookid)){
            borrower.rentbooks.push(rentreq.bookid);
        }
        // 4. Charging rent
        borrower.collateral = Number(borrower.collateral) - Number(rentreq.amount);
        await borrower.save();

        // 5. update status of the book in rent array
        const rent = await Rent.findOne({
            borrowerid: rentreq.borrowerid,
            bookid: rentreq.bookid,
        });

        rent.status = "accepted";

        await rent.save();

        // 6. set isAvailable false for the book
        const book = await Book.findOne({_id: rentreq.bookid});

        if(book){
            for(let tag of book.tags){
                if(tag.ownerid === rentreq.ownerid){
                    tag.isAvailable = false;
                }
            }
        }
            
        await book.save();

        // 1. Deleting the rentrequest
        await RentRequest.findByIdAndDelete({_id: rentreq._id});


        res.status(200).json({
            msg: "Success",
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: {
                common: {
                    msg: "Server Error",
                }
            }
        })
    }
}

// cancelling rent request
async function cancelRentRequest(req, res) {
    const rentreq = req.body;
    try {
        // 3 tasks should be done 1. deleting the rentrequest 2. removing it from borrower 3. updating the rent status

        // 2. Removing rentreqs from borrower
        const borrower = await User.findOne({_id: rentreq.borrowerid})
        borrower.rentrequests = await borrower.rentrequests.filter((id) => id != rentreq._id);

        await borrower.save();
        
        // 1. Deleting the rentrequest
        await RentRequest.findByIdAndDelete({_id: rentreq._id});

         // 5. update status of the book in rent array
         const rent = await Rent.findOne({
            borrowerid: rentreq.borrowerid,
            bookid: rentreq.bookid,
        });

        rent.status = "cancelled";

        await rent.save();

        res.status(200).json({
            msg: "Success",
        })
        
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            errors: {
                common: {
                    msg: "Server Error",
                }
            }
        })
    }
}

// remove rentRequest
async function removeRentRequest(req, res) {
    try {
        const rentrequest = await RentRequest.findByIdAndDelete({
            _id: req.params.id,
        });

        const user = await User.findOne({ _id: rentrequest.borrowerid });

        // need to modify later
        user.rentrequests = user.rentrequests.map(
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
    cancelRentRequest,
    acceptRentRequest,
    getRentRequest,
    addRentRequest,
    removeRentRequest,
};
