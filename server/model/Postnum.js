const mongoose = require('mongoose');

const PostnumSchema = mongoose.Schema({
  totalpost: {
    type: Number,
    default: 0,
  },
  name: {
    type: String,
    default: 'totalpost',
  },
});
const CommentnumSchema = mongoose.Schema({
  totalcomment: {
    type: Number,
    default: 0,
  },
  name: {
    type: String,
    default: 'totalcomment',
  },
});

const Commentnum = mongoose.model('Commentnum', CommentnumSchema);
const Postnum = mongoose.model('Postnum', PostnumSchema);

module.exports = { Postnum, Commentnum };
