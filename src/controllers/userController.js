const boom = require('boom');
const User = require('../models/User');
const crypto = require('crypto');

// Get all Users
exports.getUsers = async (req, reply) => {
  try {
    const users = await User.find();
    return users;
  } catch (err) {
    throw boom.boomify(err);
  }
}

// Add/Signup user
exports.addUser = async req => {
	try {
		const user = new User(req);
    user.verification_token = crypto.randomBytes(64).toString('hex');
    user.is_verified = false;
    
		const newUser = await user.save();
		return newUser;
	} catch (err) {
		throw boom.boomify(err);
	}
}

exports.verifyUser = async req => {
	try {
		
    const email = req.params === undefined ? req.email : req.params.email;
    const verification_token = req.params === undefined ? req.verification_token : req.params.verification_token;
		
    const filter = { 
      email: email,
      verification_token: verification_token
    };

  	const update = await User.findOneAndUpdate(filter, { is_verified: true }, {
       new: true,
       useFindAndModify: true 
      });
		
    return update
	} catch (err) {
		throw boom.boomify(err);
	}
}