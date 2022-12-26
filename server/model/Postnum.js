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

const Postnum = mongoose.model('Postnum', PostnumSchema);

module.exports = { Postnum };

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

module.exports = { Commentnum };
