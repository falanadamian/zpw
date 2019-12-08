const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    message: {
        type: String,
        required: [true, 'Message is required']
    },
    sent: {
        type: Date,
        required: [true, 'Created date is required']
    }
})

module.exports = messageSchema;
