const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Add other user fields as needed (e.g., email, profile info)
});

module.exports = mongoose.model('User', userSchema);
