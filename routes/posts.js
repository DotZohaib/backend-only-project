const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  picture: String,
  title: String,
  content: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  prices: Number,
  date: {
    type: Date,
    default: Date.now
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }],
});

module.exports = mongoose.model('posts', postSchema);
