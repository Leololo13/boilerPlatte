const mongoose = require('mongoose');

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
  role: {
    type: Number,
    default: 1,
  },
  like: {
    type: Number,
  },
  hate: {
    type: Number,
  },

  image: {
    type: String,
  },
  views: {
    type: Number,
    default: 0,
  },
  postnum: {
    type: Number,
  },
  writer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  },
});

const List = mongoose.model('List', listSchema);
module.exports = { List };
