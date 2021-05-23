const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  verification_token: String,
  is_verified: Boolean
});

module.exports = mongoose.model('User', userSchema)