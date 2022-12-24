const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  writer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  postnum: {
    type: Number,
  },
  content: {
    type: String,
    maxlength: 300,
  },
  like: {
    type: Number,
    default: 0,
  },
  hate: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = { Comment };
