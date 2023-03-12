const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  writer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List',
  },
  nickname: {
    type: String,
  },
  commentnum: {
    type: Number,
    default: 0,
  },
  postnum: {
    type: Number,
  },
  content: {
    type: String,
    maxlength: 300,
  },
  parentcommentnum: {
    type: Number,
    default: 0,
  },
  like: {
    type: Array,
    default: [],
  },
  hate: {
    type: Array,
    default: [],
  },

  date: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: Number,
    default: 1,
  },
  target: {
    type: String,
  },
  image: {
    type: String,
  },
  report: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  report_count: {
    type: Number,
    default: 0,
  },
});

commentSchema.methods.addRecomment = function (data) {
  this.recomment.push({ content: data.content, writer: data.writer });
  return this.save;
};

const Comment = mongoose.model('Comment', commentSchema);
module.exports = { Comment };
