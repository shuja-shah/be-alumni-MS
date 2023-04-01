const express = require('express');
const router = express.Router();
const User = require('../models/user');


router.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        console.log(user);
        await user.save();
        res.status(201).send({ message: 'User created' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send({ error: 'Invalid email or password' });
        }

        if (!user.is_active) {
            return res.status(401).send({ error: 'Your account is not activated' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).send({ error: 'Invalid email or password' });
        }

        const token = user.generateAuthToken();

        res.send({ token });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

module.exports = router;