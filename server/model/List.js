const mongoose = require('mongoose');

const CountSchema = mongoose.Schema({
  count: Number,
});

const listSchema = mongoose.Schema({
  id: {
    type: String,
  },
  nickname: {
    type: String,
  },
  title: {
    type: String,
    minlength: 5,
    maxlength: 50,
  },
  content: {
    type: String,
    minlength: 5,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  postnum: {
    type: Number,
  },
  email: {
    type: String,
  },
  like: {
    type: Number,
  },
  hate: {
    type: Number,
  },
  role: {
    type: Number,
    default: 1,
  },
  image: {
    type: String,
  },
});

const List = mongoose.model('List', listSchema);
const Count = mongoose.model('Counter', CountSchema);
module.exports = { List, Count };
