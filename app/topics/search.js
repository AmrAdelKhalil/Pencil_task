const { Topic } = require("../../db/models");

const getQuestionsOfATopicSubTree = async (topic) => {
    let questions = new Set();
    let topicSubTree = await Topic.aggregate([
        { 
            $match: { name: topic }
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

    if(topicSubTree.length > 0) {
        topicSubTreeRoot = topicSubTree[0];
        questions = new Set([...topicSubTreeRoot.questions]);
        for(let i = 0; i < topicSubTreeRoot.hierarchy.length; i++) {
            questions = new Set([...topicSubTreeRoot.hierarchy[i].questions, ...questions]);
        }
    }
    
    return Array.from(questions);
}

module.exports = {
    getQuestionsOfATopicSubTree
}