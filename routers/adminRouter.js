const express = require('express');

const { getAgent, addAgent, removeAgent } = require('../controllers/adminController');
const { agentValidators, agentValidationHandler } = require('../middlewires/admin/agentValidator');

const router = express.Router();

// login page
router.get('/', getAgent);

router.post('/', agentValidators, agentValidationHandler, addAgent);

router.delete('/:email', removeAgent);

module.exports = router;
