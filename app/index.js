const mongoose = require("mongoose");

if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(
        "mongodb://admin:admin@localhost:27017/pencil?authSource=admin"
    );
}

const dataSeeder = require('../db/seed/parser')

const app = require('./app')
const port = 8080

const run = async () => {
    try {
        // Seed our database
        await dataSeeder();

        // Run the server up
        app.listen(port, async () => {
            console.log(`Example app listening on port ${port}`)
        })
    } catch(e) {console.log(e);}  
}

run();