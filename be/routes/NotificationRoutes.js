const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');
const { authCheck } = require("../middlewares/_auth");

router.get('/', authCheck, async (req, res) => {
    try {
        const notifications = await Notification.find();
        if (!notifications || !notifications.length) {
            return res.status(404).send({ error: 'There are no recent Notifications' });
        }
        res.send(notifications);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;