const { ObjectId } = require('mongodb');
let mongoose = require('mongoose');

let TopicSchema = new mongoose.Schema({
  name: String,
  children: {
    type: [{type: ObjectId, ref: 'Topic'}],
    default: []
  },
});

module.exports = mongoose.model('Topic', TopicSchema);