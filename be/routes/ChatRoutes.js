const express = require('express');
const router = express.Router();
const Chat = require('../models/conversation');
const Message = require('../models/message');
const { authCheck } = require("../middlewares/_auth");

// Get all chats
router.get('/chats', authCheck, async (req, res) => {
    try {
        const chats = await Chat.find();
        res.send(chats);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Get a specific chat by its id
router.get('/chats/:id', authCheck, async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id);
        res.send(chat);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Create a new chat
router.post('/chats', authCheck, async (req, res) => {
    try {
        const { name, members } = req.body;
        const createdBy = req.user._id;
        const newChat = new Chat({ name, members, createdBy });
        const savedChat = await newChat.save();
        res.send(savedChat);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Add a new message to a chat by its id
router.post('/chats/:id/messages', authCheck, async (req, res) => {
    try {
        const { text } = req.body;
        const chatId = req.params.id;
        const sender = req.user._id;
        const newMessage = new Message({ text, chatId, sender });
        const savedMessage = await newMessage.save();
        res.send(savedMessage);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Get all messages sent in all chats (admin only)
router.get('/messages', authCheck, async (req, res) => {
    try {
        const messages = await Message.find().populate('chatId');
        res.send(messages);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
