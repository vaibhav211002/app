const mongoose = require('mongoose');
const plm = require('passport-local-mongoose')

// mongoose.connect("mongodb://127.0.0.1:27017/databases")
// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId, // Assuming posts are stored as an array of strings
    ref : 'Post'
  }],
  dp: {
    type: String // Assuming the profile picture is stored as a URL or file path
  }
});

// Create the user model


userSchema.plugin(plm)
module.exports = mongoose.model('User', userSchema);

