const fs = require("fs");
const { parse } = require("csv-parse");

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
        console.log(final);
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

fs.createReadStream("./topics.csv")
.pipe(parse({ delimiter: ",", from_line: 2 }))
.on("data", function (row) {
    dataHolder.appendData(row);
}).on('finish', function() {
    let tree = printTheData(dataHolder);
    tree.printTree();
});
