const mongoose = require('mongoose');

const agentSchema = mongoose.Schema(
    {
        agentid: {
            type: String,
            required: true,
        },
        taskcount: {
            type: String,
            required: true,
        },
        onwork: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Agent = mongoose.model('Agent', agentSchema);

module.exports = Agent;
