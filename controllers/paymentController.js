const User = require('../models/people');
const Payment = require('../models/payment');


// for payment success
async function paymentSuccess(req, res) {
    try {

        let payment = await Payment.findOne({ tranid: req.body.tran_id });
        
        console.log(payment);
        if(!payment){

            payment = new Payment({
                tranid: req.body.tran_id,
                amount: req.body.amount,
            });
        }
        
        await payment.save();

        const user = await User.findOne({_id: req.body._id});

        user.collateral = req.body.amount;

        await user.save();

        res.status(200).json({
            msg: "Payment successful",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: {
                common: {
                    msg: "Unknown error occurred",
                }
            }
        });
    }
}

module.exports = {
    paymentSuccess,
};