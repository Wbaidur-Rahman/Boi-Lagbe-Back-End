const User = require('../models/people');
const Agent = require('../models/agents');
const Warhouse = require('../models/warhouse');
const Book = require('../models/book');

const SSLCommerzPayment = require('sslcommerz-lts')

function createRandomString(length){
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
    let key = "";
    while(length--){
        key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return key;
}


// function for paying user Collateral
async function paycollateral(req, res){
    const store_id = process.env.store_id
    const store_passwd = process.env.store_passwd
    const is_live = false //true for live, false for sandbox

    const port = process.env.port
    const tran_id = createRandomString(34);
    console.log(tran_id);

    try {
    const user = req.body;
    // console.log(user);
    const data = {
        total_amount: user.payamount,
        currency: 'BDT',
        tran_id, // use unique tran_id for each api call
        success_url: 'http://localhost:5173/success',
        fail_url: 'http://localhost:5173/fail',
        cancel_url: 'http://localhost:5173/cancel',
        ipn_url: 'http://localhost:5173/ipn',
        cus_name: user.name,
        cus_email: user.email,
        cus_add1: user.address,
        cus_country: 'Bangladesh',
        cus_phone: user.mobile,
    };
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
    sslcz.init(data).then(apiResponse => {
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL? apiResponse.GatewayPageURL:"http://localhost:5173/"
        console.log('Redirecting to: ', GatewayPageURL)
        res.status(200).json({
            url: GatewayPageURL,
        })
    });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: {
                common: {
                    msg: "Unknown error occured",
                }
            }
        })
    }
}

// function for storing book into warhouse
async function storeBooksIntoWarhouse(req, res) {
    const {book_ids} = req.body;
    console.log(book_ids);
    const warhouse = await Warhouse.findOne();

    try {
        for(let book_id of book_ids){
            const book = await Book.findOne({_id: book_id});
            book.tags.isStored = true;
            await book.save();
            warhouse.stored_books.push(book_id);
        }

        res.status(200).json({
            msg: "Book stored successfully",
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: {
                common: {
                    msg: "Unknown error occured",
                }
            }
        })
    }

}

// function for getting all store requests
async function getStoreRequests(req, res) {
    try {
        const warhouse = await Warhouse.findOne();
        res.status(200).json({
            storereqs: warhouse.store_reqs,
        });
        
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

// function for acknowledging store requests
async function acknowledgeStoreRequests(req, res){
    const storing_books = req.body;
    try {
        const warhouse = await Warhouse.findOne();
        
        for(let storing_book of storing_books){
            const book = await Book.findOne({_id: storing_book.bookid});
            for(let tag of book.tags){
                if(tag.ownerid === storing_book.ownerid)
                    tag.isStored = true;
            }
            await book.save();
            warhouse.stored_books.push(storing_book.bookid);
        }

        warhouse.store_reqs = warhouse.store_reqs.filter(store_req => {
            return !storing_books.some(book => book.bookid === store_req.bookid);
        });

        await warhouse.save();

        res.status(200).json({
            msg: "Success",
        })
    } catch (error) {
        res.status(500).json({
            errors: {
                common: {
                    msg: "Unknown Error Occured",
                }
            }
        })
    }
}

// create a warhouse
async function createWarhouse(req, res) {
    const warhouse = new Warhouse({
        ...req.body,
    });

    try {
        await warhouse.save();
        res.status(200).json({
            msg: "Warhouse Created Successfully",
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: {
                common: {
                    msg: "Could not create a warhouse",
                }
            }
        })
    }
}

// get an agent
async function getAgent(req, res) {
    try {
        const agent = await Agent.findOne({ onwork: true });

        if (agent) {
            res.status(200).json({
                agent,
            });
        } else {
            // throw createError('Unknown error while reading data');
            res.status(404).json({
                errors: {
                    common: {
                        msg: 'No Agent found',
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

// add addAgent
async function addAgent(req, res) {
    // finding the user with given  email
    const user = await User.findOne({ email: req.body.email });

    // if the User is not in database
    if (!user) {
        res.status(404).json({
            errors: {
                common: {
                    msg: 'No user found for the email',
                },
            },
        });
        return;
    }

    if (req.body.role) user.role = req.body.role;
    if (req.body.mobile) user.mobile = req.body.mobile;

    const agent = new Agent({
        agentid: user._id,
        taskcount: '0',
        onwork: true,
    });

    // save Book or send error
    try {
        // Save the user document
        await user.save();
        await agent.save();

        res.status(200).json({
            msg: 'Agent was added successfully',
        });
    } catch (err) {
        console.log(err); // here I have a console.log()
        res.status(500).json({
            errors: {
                common: {
                    msg: 'Unknown error occurred many time',
                },
            },
        });
    }
}

// remove agent
async function removeAgent(req, res) {
    try {
        const user = await User.findOne({ email: req.params.email });

        // if the User is not in database
        if (!user) {
            res.status(404).json({
                errors: {
                    common: {
                        msg: 'No user found for the email',
                    },
                },
            });
            return;
        }

        const agent = await Agent.findOne({ agentid: user._id });
        await Agent.findByIdAndDelete({ _id: agent._id });

        user.role = 'user';
        await user.save();

        res.status(200).json({
            msg: 'Agent removed successfully',
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
    paycollateral,
    acknowledgeStoreRequests,
    getStoreRequests,
    createWarhouse,
    addAgent,
    getAgent,
    removeAgent,
};
