const express = require('express');
const mongoose = require('mongoose');
const app = express();
const { mongodb } = require("./config/db");
mongoose.connect(mongodb.uri).then(() => {
    app.listen('5000', () => {
        console.log('Listening on 5000');
    })
})
    .catch(err => console.log(err));
