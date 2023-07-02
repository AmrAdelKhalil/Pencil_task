const express = require('express')
const mongoose = require("mongoose");
const dataSeeder = require('../db/seed/parser')

const app = express()
const port = 8080

const { Topic } = require("../db/models/index");
app.get('/search', async (req, res) => {
    let { q } = req.query;
    if(q === undefined) {
        res.send("You need to enter a parameter q in URL")
    } else {
        q = "Movement of Substances";
        let topicSubTree = await Topic.aggregate([
            { 
                $match: { name: q }
            },
            {
                $graphLookup: {
                    from: Topic.collection.collectionName,
                    startWith: "$children",
                    connectFromField: "children",
                    connectToField: "_id",
                    as: "hierarchy",
                }
            }
        ]);
        topicSubTree = topicSubTree[0];
        let questions = new Set([...topicSubTree.questions]);
        for(let i = 0; i < topicSubTree.hierarchy.length; i++) {
            console.log(topicSubTree.hierarchy[i].questions);
            // for(let j = 0; j < topicSubTree.hierarchy[i].questions.length; j++)
            questions = new Set([...topicSubTree.hierarchy[i].questions, ...questions]);
        }
        res.send(Array.from(questions));
    }
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