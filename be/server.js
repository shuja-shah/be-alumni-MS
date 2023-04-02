const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const { mongodb } = require("./config/db");
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const detRoutes = require('./routes/users');
const jobRoutes = require('./routes/JobRoutes');
app.use(cors());


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/users', detRoutes);
app.use('/api/jobs', jobRoutes);

mongoose.connect(mongodb.uri).then(() => {
    app.listen('5000', () => {
        console.log('Listening on 5000');
    })
})
    .catch(err => console.log(err));
