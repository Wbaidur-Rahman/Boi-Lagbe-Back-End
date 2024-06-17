const express = require('express');

const { getStoreRequests, acknowledgeStoreRequests, getAgent, addAgent, removeAgent, createWarhouse } = require('../controllers/adminController');
const { agentValidators, agentValidationHandler } = require('../middlewires/admin/agentValidator');

const router = express.Router();

// login page
router.get('/', getAgent);
router.get('/storereqs', getStoreRequests);

router.post('/storereqs', acknowledgeStoreRequests);
router.post('/warhouse', createWarhouse);
router.post('/', agentValidators, agentValidationHandler, addAgent);

router.delete('/:email', removeAgent);

module.exports = router;
