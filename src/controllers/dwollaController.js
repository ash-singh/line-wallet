const boom = require('boom');
const User = require('../models/User');
const {prettyPrintResponse, formatError} = require('../util');
const dwollaClient = require('../libs/dwolla/client');

const linkWalletSource = (userId, walletUrl) => {
  var requestBody = {
    routingNumber: "222222226",
    accountNumber: "123456789",
    bankAccountType: "checking",
    name: "Jane Merchant - Checking 6789",
  };

  dwollaClient
    .post(`${walletUrl}/funding-sources`, requestBody)
    .then(function (res) {
      const fundingSource = res.headers.get("location");
      console.log(fundingSource);

      const update = { 
        dwolla_wallet: walletUrl, 
        dwolla_funding_source: fundingSource
      };

      return User.findByIdAndUpdate(userId, update, {new: true,});
    });
}

exports.createWallet = async req => {
	try {
		
    const userId = req.params === undefined ? req.user_id : req.params.user_id;

    var requestBody = {
      firstName: "Ashwani",
      lastName: "Singh",
      email: "ashwani4u4888+8@gmail.com",
      type: "receive-only",
      ipAddress: "99.99.99.99",
    };
    
    dwollaClient.post("customers", requestBody).then(function (res) {
      const wallet = res.headers.get("location"); 
      
      linkWalletSource(userId, wallet);

    }).catch(function(err){
      prettyPrintResponse(err);
    });
    
	} catch (err) {
		prettyPrintResponse(err);
	}
}
