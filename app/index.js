const express = require('express')
const mongoose = require("mongoose");
const dataSeeder = require('../db/seed/parser')
const { getQuestionsOfATopicSubTree } = require("./topics/index");

const app = express()
const port = 8080

app.get('/search', async (req, res) => {
    let { q } = req.query;
    let questions = [];
    if(q !== undefined) {
        questions = await getQuestionsOfATopicSubTree(q);
    }
    res.send(questions);
})

const run = async () => {
    try {

        // Set DB connection
        await mongoose.connect(
            "mongodb://admin:admin@localhost:27017/pencil?authSource=admin"
        );

        // Seed our database
        await dataSeeder();

        // Run the server up
        app.listen(port, async () => {
            console.log(`Example app listening on port ${port}`)
        })
    } catch(e) {console.log(e);}  
}

run();