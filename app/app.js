const express = require('express')

const { getQuestionsOfATopicSubTree } = require("./topics/index");

const app = express()

app.get('/search', async (req, res) => {
    let { q } = req.query;
    let questions = [];
    if(q !== undefined) {
        questions = await getQuestionsOfATopicSubTree(q);
    }
    res.json({ questions_ids: questions });
})

module.exports = app