const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    chatRoom: {
        type: String, // This could be a conversation ID or chat room ID
        required: true
    },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('chat', ChatSchema);
