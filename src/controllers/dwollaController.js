const {User} = require('../models/Model');
const {prettyPrintResponse} = require('../util');
const dwollaClient = require('../libs/dwolla/client');

const linkWalletSource = (user, customerUrl, fundingSourceLink) => {
 
  dwollaClient
    .get(`${customerUrl}/funding-sources`)
    .then(function (res) {
      var fundingSources = res.body._embedded["funding-sources"];

      var balanceAccount = {};

      for (let fundingSource of fundingSources) {
        if (fundingSource.type == 'balance') {
          balanceAccount = {
            id: fundingSource.id,
            funding_source: fundingSource._links.self.href,
            created:  fundingSource.created,
            source_type: fundingSource.type,
            name: fundingSource.name,
          };
        }
      }

      var dwolla = {
        customer: customerUrl,
        funding_source: fundingSourceLink,
        wallet : balanceAccount
      };

      return User.findByIdAndUpdate(user._id, { dwolla: dwolla}, {new: true, useFindAndModify:false});
    });
}

const linkBankAccount = (user, customerUrl) => {
 
    var requestBody = {
      routingNumber: user.placid.account.routing,
      accountNumber: user.placid.account.account,
      bankAccountType: user.placid.account.account_type,
      name: user.placid.account.name,
    };

    dwollaClient
      .post(`${customerUrl}/funding-sources`, requestBody)
      .then(function (res) {
        var fundingSource = res.headers.get("location");

        var dwolla = {
          customer: customerUrl,
          funding_source: fundingSource
        };
        
        linkWalletSource(user, customerUrl, fundingSource);
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
      type: 'personal',
      ipAddress: '99.99.99.99',
      address1: user.placid.address.street,
      city: user.placid.address.city,
      state: user.placid.address.region,
      postalCode: user.placid.address.postal_code,
      dateOfBirth: "1970-01-01",
      ssn: "1234"
    };
    
    dwollaClient.post("customers", requestBody).then(function (res) {
      const customerUrl = res.headers.get("location"); 
      
      linkBankAccount(user, customerUrl);

    }).catch(function(err){
      prettyPrintResponse(err);
    });
    
	} catch (err) {
		prettyPrintResponse(err);
	}
}
