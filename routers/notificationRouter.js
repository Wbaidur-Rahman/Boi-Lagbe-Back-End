const express = require('express');

const {
    getNotification,
    addNotification,
    removeNotification,
} = require('../controllers/notifyController');
const {
    addNotificationValidators,
    addNotificationValidationHandler,
} = require('../middlewires/notification/notificationValidator');

const router = express.Router();

// login page
router.get('/', getNotification);

router.post('/', addNotificationValidators, addNotificationValidationHandler, addNotification);

router.delete('/:id', removeNotification);

module.exports = router;
