const express = require("express");
const router = express.Router();
const { authCheck } = require("../middlewares/_auth");
const User = require("../models/user");

router.get("/", authCheck, async (req, res) => {
    try {
        const alumnis = await User.find({ is_alumni: true });
        const students = await User.find({ is_student: true });

        res.send({ alumnis, students });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.get('/self', authCheck, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -__v');
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.send(user);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


module.exports = router;
