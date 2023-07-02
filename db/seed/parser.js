const fs = require("fs");
const { parse } = require("csv-parse");
const { Topic } = require("../models/index");

class DataHolder {
    data;
    constructor() {
        this.data = [];
    }

    appendData(row) {
        this.data.push(row);
    }
};

class Node {
    val;
    children;
    constructor() {
        this.val = null;
        this.children = [];
    }

    setVal(newVal) {
        this.val = newVal;
    }

    addNewChild(value) {
        let newChild = new Node();
        newChild.setVal(value);
        this.children.push(newChild);
    }

    findChild(value) {
        for(let i = 0 ; i < this.children.length; i++) {
            if(value === this.children[i].val) {
                return i;
            }
        }
        return -1;
    }
}

class Tree {
    root;
    constructor() {
        this.root = new Node();
    }

    /**
     * Insert a single row of data into the tree
     * @param {Array} values represents a uniqe path to a child node
     */
    insert(values) {
        let iterator = this.root;
        for(let i = 0; i < values.length; i++) {
            let value = values[i];
            if(!value || value == '0' || value == "0") {
                continue;
            }
            let existsAt = iterator.findChild(value);
            if(existsAt === -1) {
                iterator.addNewChild(value);
                iterator = iterator.children[iterator.children.length - 1];
            } else {
                iterator = iterator.children[existsAt];
            }
        }
    }
    
    /**
     * Used while testing the script against creating the tree data structure
     */
    printTree() {
        let level = 0;
        let iterator = this.root;
        let queue = [];
        for(let i = 0 ; i < iterator.children.length; i++) {
            queue.push(
                [iterator.children[i], level]
            );
        }
        let final = {0:[], 1:[], 2:[]};
        while(queue.length > 0) {
            let item = queue[0];
            queue.shift();
            for(let i = 0; i < item[0].children.length; i++) {
                queue.push([item[0].children[i], item[1] + 1]);
                
            }
            final[item[1]].push(item[0].val);
        }
    }

    /**
     * Essential function to seed DB with our data. Considered as a starting point for
     * our application
     * Using the BFS algorithm it would allow us to seed the database
     */
    async seedDBWithTopicsData(topicToQuestionMap) {
        await Topic.deleteMany();
        let iterator = this.root;
        let queue = [];
        for(let i = 0 ; i < iterator.children.length; i++) {
            queue.push(
                [iterator.children[i], null]
            );
        }
        while(queue.length > 0) {
            let item = queue[0];
            queue.shift();
            let newTopic = new Topic({
                name: item[0].val,
                children: [],
                questions: (item[0].val in topicToQuestionMap) ? topicToQuestionMap[item[0].val] : []
            });
            await newTopic.save();
            if(item[1] !== null) {
                let parent = item[1];
                parent.children.addToSet(newTopic);
                await parent.save();
            }
            for(let i = 0; i < item[0].children.length; i++) {
                queue.push([item[0].children[i], newTopic]);
            }
        }
    }
}


const dataHolder = new DataHolder();


function printTheData(dataHolder) {
    let t = new Tree();
    for(let i = 0; i < dataHolder.data.length; i++) {
        t.insert(dataHolder.data[i]);
    }
    return t;
}

const seedTopics = async (topicToQuestionMap) => {
    fs.createReadStream("./db/data/topics.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
        dataHolder.appendData(row);
    }).on('finish', async function() {
        let tree = printTheData(dataHolder);
        tree.printTree();
        await tree.seedDBWithTopicsData(topicToQuestionMap);
    });
}

const seedQuestions =  () => {
    const questionsAnnotations = [];
    fs.createReadStream("./db/data/questions.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
        const questionAnnotation = [];
        for(let i = 0 ; i < row.length; i++) {
            if(row[i] !== '' && row[i] !== ' ' && row[i].length > 0) {
                questionAnnotation.push(row[i]);
            }
        }
        if(questionAnnotation.length > 1) {
            questionsAnnotations.push(questionAnnotation);
        }
    }).on('finish', async function() {
        let topicToQuestionMap = {};
        for(let i = 0; i < questionsAnnotations.length; i++) {
            let id = questionsAnnotations[i][0];
            if(id > 199) {
                let a;
            }
            questionsAnnotations[i].shift();
            for(let j = 0; j < questionsAnnotations[i].length; j++) {
                if(questionsAnnotations[i][j] in topicToQuestionMap) {
                    topicToQuestionMap[questionsAnnotations[i][j]].push(id);
                } else {
                    topicToQuestionMap[questionsAnnotations[i][j]] = [id];
                }
            }
        }
        await seedTopics(topicToQuestionMap);
    });
}

const runSeeder = async () => {
    await seedQuestions();
}

module.exports = runSeeder
