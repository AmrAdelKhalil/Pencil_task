const mongoose = require("mongoose");

if (process.env.NODE_ENV === 'test') {
    mongoose.connect(
        "mongodb://admin:admin@localhost:27017/pencil?authSource=admin"
    );
} else if(process.env.NODE_ENV === 'dev') {
    mongoose.connect(
        `mongodb://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_URL}/${process.env.DATABASE_NAME}?authSource=admin`
    );
}
else {
    mongoose.connect(
        "mongodb+srv://${process.env.DATABASE_USERNAME:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_URL}/${process.env.DATABASE_NAME}?retryWrites=true&w=majority"
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