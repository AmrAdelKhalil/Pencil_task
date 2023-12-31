const { ObjectId } = require('mongodb');
let mongoose = require('mongoose');

let TopicSchema = new mongoose.Schema({
  name: String,
  children: {
    type: [{type: ObjectId, ref: 'Topic'}],
    default: []
  },
  questions: {
    type: [{type: Number}],
    default: []
  }
});


const Topic = mongoose.model("Topic", TopicSchema);

module.exports = { Topic };