const mongoose = require('mongoose');
// Define the post schema
const postSchema = new mongoose.Schema({
  postText: {
    type: String,
    required: true
  },
  image : {
    type : String
  },
  user : {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User'
    
  },
  currentDate: {
    type: Date,
    default: Date.now
  },
  time: {
    type: String, // You can use a specific time format or store it as a Date object
  },
  likes: {
    type: Array,
    default: []
  }
});

// Create the post model
const PostModel = mongoose.model('Post', postSchema);

module.exports = PostModel;

