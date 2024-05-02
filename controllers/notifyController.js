const User = require('../models/people');
const Notification = require('../models/notification');

// get a notification
async function getNotification(req, res) {
    try {
        const notification = await Notification.findOne({ _id: req.query.id });

        if (notification) {
            res.status(200).json({
                notification,
            });
        } else {
            // throw createError('Unknown error while reading data');
            res.status(404).json({
                errors: {
                    common: {
                        msg: 'No notification found',
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

// add notification
async function addNotification(req, res) {
    // if the RentRequest is not in database
    const notification = new Notification({
        ...req.body,
    });

    // save notification or send error
    try {
        await notification.save();

        // Find the user based on ownerid
        const user = await User.findOne({ _id: req.body.ownerid });

        if (!user.notifications) user.notifications = [];

        // Check if the rent request ID is already in the user's rent requests array
        if (!user.notifications.includes(notification._id)) {
            // If not present, push it into the array
            user.notifications.push(notification._id);
        }

        // Save the user document
        await user.save();

        res.status(200).json({
            msg: 'Notification was added successfully',
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

// remove notification
async function removeNotification(req, res) {
    try {
        const notification = await Notification.findByIdAndDelete({
            _id: req.params.id,
        });

        const user = await User.findOne({ _id: notification.ownerid });
        user.notifications = user.notifications.map(
            (notificationid) => notificationid !== notification._id
        );
        await user.save();

        res.status(200).json({
            msg: 'Notification was removed successfully',
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            errors: {
                common: {
                    msg: 'Could not delete the Notification!',
                },
            },
        });
    }
}

module.exports = {
    getNotification,
    addNotification,
    removeNotification,
};
