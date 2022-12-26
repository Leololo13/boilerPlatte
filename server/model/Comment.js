const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  writer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  like: {
    type: Array,
    default: [],
  },
  hate: {
    type: Array,
    default: [],
  },
  recomment: [
    new mongoose.Schema({
      content: String,
      writer: String,
      id: mongoose.Schema.Types.ObjectId,
    }),
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

commentSchema.methods.addRecomment = function (data) {
  this.recomment.push({ content: data.content, writer: data.writer });
  return this.save;
};

const Comment = mongoose.model('Comment', commentSchema);
module.exports = { Comment };
