const express = require("express");
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Chat = require('../models/Chat');
const { body, validationResult } = require('express-validator');

// Route 1: Send a message - Login required
router.post('/send', [
    fetchuser,
    body('message', 'Message cannot be empty').notEmpty(),
    body('receiver', 'Receiver is required').notEmpty(),
    body('chatRoom', 'Chat room ID is required').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { message, receiver, chatRoom } = req.body;
        const newMessage = new Chat({
            sender: req.user.id,
            receiver,
            message,
            chatRoom,
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Route 2: Get messages for a chat room - Login required
router.get('/room/:chatRoom', fetchuser, async (req, res) => {
    try {
        const chatRoom = req.params.chatRoom;
        const messages = await Chat.find({ chatRoom }).sort({ date: -1 });
        res.json(messages);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Route 3: Get messages between two users - Login required
router.get('/user/:receiver', fetchuser, async (req, res) => {
    try {
        const receiver = req.params.receiver;
        const messages = await Chat.find({
            $or: [
                { sender: req.user.id, receiver },
                { sender: receiver, receiver: req.user.id }
            ]
        }).sort({ date: -1 });
        res.json(messages);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
