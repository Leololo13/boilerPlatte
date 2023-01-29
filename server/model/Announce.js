const mongoose = require('mongoose');

const AnnounceSchema = mongoose.Schema({
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
  category: {
    type: String,
    trim: 1,
  },
  writer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

const Announce = mongoose.model('Announce', AnnounceSchema);
module.exports = { Announce };
