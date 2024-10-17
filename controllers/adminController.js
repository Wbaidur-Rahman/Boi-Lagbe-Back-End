const User = require('../models/people');
const Agent = require('../models/agents');
const Warhouse = require('../models/warhouse');
const Book = require('../models/book');

const SSLCommerzPayment = require('sslcommerz-lts');


function createRandomString(length){
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
    let key = "";
    while(length--){
        key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return key;
}


/************************************
async function paycollateral(req, res){
    const store_id = process.env.store_id;
    const store_passwd = process.env.store_passwd;
    const is_live = false; // true for live, false for sandbox

    const tran_id = createRandomString(34);
    console.log('Generated tran_id:', tran_id);

    try {
        const user = req.body;
        const data = {
            total_amount: Number(user.payamount),
            currency: 'BDT',
            tran_id, // use unique tran_id for each API call
            success_url: 'http://localhost:5173/success',
            fail_url: 'http://localhost:5173/fail',
            cancel_url: 'http://localhost:5173/cancel',
            ipn_url: 'http://localhost:5173/ipn',
            cus_name: user.name,
            cus_email: user.email,
            cus_add1: user.address,
            cus_country: 'Bangladesh',
            cus_phone: user.mobile,
            shipping_method: 'NO',
            product_name: 'Book',
            product_category: 'Book',
            product_profile: 'general',
        };

        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        const apiResponse = await sslcz.init(data);

        if (apiResponse && apiResponse.GatewayPageURL) {
            let GatewayPageURL = apiResponse.GatewayPageURL;
            console.log('Redirecting to:', GatewayPageURL);
            res.status(200).json({
                url: GatewayPageURL,
            });
        } else {
            console.error('Failed to get GatewayPageURL from API response:', apiResponse);
            res.status(500).json({
                errors: {
                    common: {
                        msg: "Failed to initiate payment",
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error occurred during payment initiation:', error);
        res.status(500).json({
            errors: {
                common: {
                    msg: "Unknown error occurred",
                }
            }
        });
    }
}
    *****************************************************************/





/********************************************************************/

const https = require('https');
const querystring = require('querystring');

async function paycollateral(req, res) {
    const store_id = process.env.store_id;
    const store_passwd = process.env.store_passwd;
    const is_live = false; // true for live, false for sandbox

    const tran_id = createRandomString(34);
    console.log('Generated tran_id:', tran_id);

    try {
        const user = req.body;
        const data = {
            store_id: store_id,
            store_passwd: store_passwd,
            total_amount: Number(user.payamount),
            currency: 'BDT',
            tran_id: tran_id, // use unique tran_id for each API call
            success_url: `http://localhost:5173/info?type=payment_success&tranid=${tran_id}`,
            fail_url: 'http://localhost:5173/fail',
            cancel_url: 'http://localhost:5173/cancel',
            ipn_url: 'https://f7b6-103-230-107-41.ngrok-free.app/ipn',
            cus_name: user.name,
            cus_email: user.email,
            cus_add1: user.address,
            cus_city: 'Rajshahi',
            cus_country: 'Bangladesh',
            cus_phone: user.mobile,
            shipping_method: 'NO',
            product_name: 'Book',
            product_category: 'Book',
            product_profile: 'general'
        };

        const postData = querystring.stringify(data);

        const options = {
            hostname: is_live ? 'securepay.sslcommerz.com' : 'sandbox.sslcommerz.com',
            path: '/gwprocess/v4/api.php',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            }
        };

        const apiRequest = https.request(options, (apiResponse) => {
            let responseData = '';

            apiResponse.on('data', (chunk) => {
                responseData += chunk;
            });

            apiResponse.on('end', () => {
                const jsonResponse = JSON.parse(responseData);

                if (jsonResponse && jsonResponse.GatewayPageURL) {
                    let GatewayPageURL = jsonResponse.GatewayPageURL;
                    console.log('Redirecting to:', GatewayPageURL);
                    res.status(200).json({
                        url: GatewayPageURL,
                    });
                } else {
                    console.error('Failed to get GatewayPageURL from API response:', jsonResponse);
                    res.status(500).json({
                        errors: {
                            common: {
                                msg: "Failed to initiate payment",
                            }
                        }
                    });
                }
            });
        });

        apiRequest.on('error', (error) => {
            console.error('Error during API request:', error);
            res.status(500).json({
                errors: {
                    common: {
                        msg: "API request failed",
                    }
                }
            });
        });

        apiRequest.write(postData);
        apiRequest.end();
    } catch (error) {
        console.error('Error occurred during payment initiation:', error);
        res.status(500).json({
            errors: {
                common: {
                    msg: "Unknown error occurred",
                }
            }
        });
    }
}


/********************************************************************/
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
