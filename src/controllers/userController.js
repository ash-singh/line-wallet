const boom = require('boom');
const User = require('../models/User');

// Get all Users
exports.getUsers = async (req, reply) => {
  try {
    const users = await User.find()
    return users
  } catch (err) {
    throw boom.boomify(err)
  }
}
