const express = require('express')
const mongoose = require("mongoose");
const dataSeeder = require('../db/seed/parser')

const app = express()
const port = 8080

app.get('/search', async (req, res) => {
  res.send('Hello World!')
})

const run = async () => {
    try {
        await mongoose.connect(
            "mongodb://admin:admin@localhost:27017/pencil?authSource=admin"
        );
        await dataSeeder();
        app.listen(port, async () => {
            console.log(`Example app listening on port ${port}`)
        })
    } catch(e) {console.log(e);}  
}

run();