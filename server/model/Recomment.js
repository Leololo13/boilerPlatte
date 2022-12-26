const mongoose = require('mongoose');

const recommentSchema = mongoose.Schema({
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
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
  date: {
    type: Date,
    default: Date.now,
  },
});

const Recomment = mongoose.model('Recomment', recommentSchema);
module.exports = { Recomment };
