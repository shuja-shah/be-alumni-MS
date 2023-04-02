const express = require('express');
const router = express.Router();
const Job = require('../models/jobs');
const { authCheck } = require("../middlewares/_auth");

router.get('/', authCheck, async (req, res) => {
    try {
        const jobs = await Job.find();
        res.send(jobs);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


router.post('/new', authCheck, async (req, res) => {
    try {
        const { position, company, location, description } = req.body;
        const created_by = req.user._id;
        const created_at = new Date();
        const newJob = new Job({
            position,
            company,
            location,
            description,
            created_by,
            created_at,
        });

        const savedJob = await newJob.save();

        res.send({ job: savedJob });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


router.put('/update/:id', authCheck, async (req, res) => {
    if (!req.body) {
        return res.status(400).send({ error: 'Job data is required' });
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ['position', 'company', 'location', 'description'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' });
    }

    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).send({ error: 'Job not found' });
        }
        updates.forEach(update => job[update] = req.body[update]);
        await job.save();

        res.send(job);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


router.delete('/delete/:id', authCheck, async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) {
            return res.status(404).send({ error: 'Job not found' });
        }
        res.send(job);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


module.exports = router;