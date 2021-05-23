const boom = require('boom');
const User = require('../models/User');
const crypto = require('crypto');
const {apiInstance, sendSmtpEmail} = require('../libs/sib/api')

// Get all Users
exports.getUsers = async (req, reply) => {
  try {
    const users = await User.find();
    return users;
  } catch (err) {
    throw boom.boomify(err);
  }
}

function sendConfirmtionEmail(user) {
  sendSmtpEmail.subject = "Confirm Line Wallet account";
  sendSmtpEmail.htmlContent = "<html><body><h1>Please verify your line wallet account </h1>" + 
    "<h3>verification token: {{params.verification_token}} </h3></body></html>";
  sendSmtpEmail.sender = {"name":"Line Wallet","email":"ashwani4u4888@gmail.com"};
  sendSmtpEmail.to = [{"email":user.email,"name":user.name}];
  
  sendSmtpEmail.params = {"verification_token": user.verification_token};

  apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
    console.log('SIB API called successfully. Returned data: ' + JSON.stringify(data));
  }, function(error) {
    console.error(error);
  });
}

// Add/Signup user
exports.addUser = async req => {
	try {
		const user = new User(req);
    user.verification_token = crypto.randomBytes(64).toString('hex');
    user.is_verified = false;
    
		const newUser = await user.save();

    // sending verification token email
    sendConfirmtionEmail(user);

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