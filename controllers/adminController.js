const User = require('../models/people');
const Agent = require('../models/agents');

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
    addAgent,
    getAgent,
    removeAgent,
};
