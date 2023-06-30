let mongoose = require('mongoose');

let QuestionSchema = new mongoose.Schema({
    _id: Number,
    annotations: {
        type: [String],
        default: []
    },
});


const Question = mongoose.model("Question", QuestionSchema);

module.exports = { Question };