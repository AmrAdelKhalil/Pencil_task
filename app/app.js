const express = require('express')
const mongoose = require("mongoose");

const app = express()

if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(
        "mongodb://admin:admin@localhost:27017/pencil?authSource=admin"
    );
}

module.exports = app