const {User} = require('../models/Model');
const {prettyPrintResponse} = require('../util');
const dwollaClient = require('../libs/dwolla/client');

const linkWalletSource = (user, walletUrl) => {

 
  var requestBody = {
    routingNumber: user.placid.account.routing,
    accountNumber: user.placid.account.account,
    bankAccountType: "checking",
    name: user.placid.account.name,
  };

  dwollaClient
    .post(`${walletUrl}/funding-sources`, requestBody)
    .then(function (res) {
      const fundingSource = res.headers.get("location");
      
      var dwallo = {
        wallet: walletUrl, 
        funding_source: fundingSource
      };

      return User.findByIdAndUpdate(user._id, { dwolla: dwallo}, {new: true, useFindAndModify:false});
    });
}

exports.createWallet = async req => {
	try {
		
    const userId = req.params === undefined ? req.user_id : req.params.user_id;
    const lineAccessToken = req.params === undefined ? req.access_token : req.params.access_token;

    const filter = {_id: userId, access_token: lineAccessToken};
    const user =  await User.findOne(filter);

    if (user === null) {
      prettyPrintResponse({filter, 'message': "Invalid user"});
      return;
    }
    
    var fullName = user.placid.full_name;

    var requestBody = {
      firstName: fullName.split(' ').slice(0, -1).join(' '),
      lastName: fullName.split(' ').slice(-1).join(' '),
      email: user.placid.email,
      type: "receive-only",
      ipAddress: "99.99.99.99",
    };
    
    dwollaClient.post("customers", requestBody).then(function (res) {
      const wallet = res.headers.get("location"); 
      
      linkWalletSource(user, wallet);

    }).catch(function(err){
      prettyPrintResponse(err);
    });
    
	} catch (err) {
		prettyPrintResponse(err);
	}
}
