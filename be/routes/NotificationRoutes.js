const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');
const { authCheck } = require("../middlewares/_auth");

router.get('/', authCheck, async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.send(notifications);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

