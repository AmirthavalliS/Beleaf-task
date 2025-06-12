const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true
  },
  id: {
    type: Number,
    required: true,
    unique: true 
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema ,"Posts");
