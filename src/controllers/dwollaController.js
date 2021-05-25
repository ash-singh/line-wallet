const {User, Transaction} = require('../models/Model');
const {prettyPrintResponse} = require('../util');
const dwollaClient = require('../libs/dwolla/client');

// Link wallet source 
const linkWalletSource = async (user, customerUrl, fundingSourceLink) => {
 
  const response = dwollaClient
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
    }).catch(err => {
      prettyPrintResponse(err)
    });

    return await response;
}

// Transfer money to/from wallet
const transfer = async (user, payload) => {
  
  const transaction = dwollaClient
    .post(`transfers`, payload)
    .then(function (res) {
      var transferLink = res.headers.get("location");

      var transaction = new Transaction()
      transaction.source = payload._links.source.href;
      transaction.destination = payload._links.destination.href;
      transaction.amount = payload.amount.value;
      transaction.currency = payload.amount.currency;
      transaction.user_id = user._id;
      transaction.wallet_id = user.dwolla.wallet.id;
      transaction.created = (new Date()).toISOString();
      transaction.transfer_link = transferLink;

      return transaction.save()
    }).catch(error => { 
      prettyPrintResponse(error);
    });
  return await transaction;
}

// Link plaicd account with dwolla customer
const linkBankAccount = async (user, customerUrl) => {
 
  var requestBody = {
    routingNumber: user.placid.account.routing,
    accountNumber: user.placid.account.account,
    bankAccountType: user.placid.account.account_type,
    name: user.placid.account.name,
  };

  const response = dwollaClient
    .post(`${customerUrl}/funding-sources`, requestBody)
    .then(function (res) {
      var fundingSource = res.headers.get("location");
  
      return linkWalletSource(user, customerUrl, fundingSource);
  }).catch(err => {
    prettyPrintResponse(err)
  });

  return await response;
}

// Create dwolla wallet
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
      //ipAddress: '99.99.99.99',
      address1: user.placid.address.street,
      city: user.placid.address.city,
      state: user.placid.address.region,
      postalCode: user.placid.address.postal_code,
      dateOfBirth: "1970-01-01",
      ssn: "1234"
    };
    
    const response = dwollaClient
      .post("customers", requestBody)
      .then(function (res) {
        const customerUrl = res.headers.get("location"); 
        return linkBankAccount(user, customerUrl);

      }).catch(function(err){
        prettyPrintResponse(err);
      });

    return await response;
    
	} catch (err) {
		prettyPrintResponse(err);
	}
}

// Deposit funds to wallet from source bank account
exports.depositFundsToWallet = async req => {
	try {
		
    const userId = req.params === undefined ? req.user_id : req.params.user_id;
    const lineAccessToken = req.params === undefined ? req.access_token : req.params.access_token;
    const amount = req.params === undefined ? req.amount : req.params.amount;
    const currency = req.params === undefined ? req.currency : req.params.currency;

    const filter = {_id: userId, access_token: lineAccessToken};
    const user =  await User.findOne(filter);

    if (user === null) {
      prettyPrintResponse({filter, 'message': "Invalid user"});
      return;
    }
    
    var payload = {
      _links: {
          source: {
            href: user.dwolla.funding_source, 
          },
          destination: {
            href: user.dwolla.wallet.funding_source
          }
      },
      amount: {
          currency: currency,
          value: amount.toString()
      }
    }
    return transfer(user, payload);
    
	} catch (err) {
		prettyPrintResponse(err);
	}
}

// Withdraw funds from wallet
exports.withdrawFundsFromWallet = async req => {
	try {
		
    const userId = req.params === undefined ? req.user_id : req.params.user_id;
    const lineAccessToken = req.params === undefined ? req.access_token : req.params.access_token;
    const amount = req.params === undefined ? req.amount : req.params.amount;
    const currency = req.params === undefined ? req.currency : req.params.currency;

    const filter = {_id: userId, access_token: lineAccessToken};
    const user =  await User.findOne(filter);

    if (user === null) {
      prettyPrintResponse({filter, 'message': "Invalid user"});
      return;
    }

    var payload = {
      _links: {
          source: {
            href: user.dwolla.wallet.funding_source ,
          },
          destination: {
            href: user.dwolla.funding_source
          }
      },
      amount: {
          currency: currency,
          value: amount.toString()
      }
    }
    return transfer(user, payload);
    
	} catch (err) {
		prettyPrintResponse(err);
	}
}


// Get wallet balance
exports.getWalletBalance = async req => {
	try {
		
    const userId = req.params === undefined ? req.user_id : req.params.user_id;
    const lineAccessToken = req.params === undefined ? req.access_token : req.params.access_token;
    
    const filter = {_id: userId, access_token: lineAccessToken};
    const user =  await User.findOne(filter);

    if (user === null) {
      prettyPrintResponse({filter, 'message': "Invalid user"});
      return;
    }
    
    const balance = dwollaClient
        .get(`${user.dwolla.wallet.funding_source}/balance`)
        .then(function (res) {
          
          data = res.body;

          const balance = {
            wallet_id: user.dwolla.wallet.id,
            currency: data.balance.currency,
            balance: data.balance.value,
            total: data.total.value,
            lastUpdated: data.lastUpdated
          }

          return balance;
        });
      return await balance;

	} catch (err) {
		prettyPrintResponse(err);
	}
}

// Get wallet transactions
exports.getWalletTransactions = async req => {
	try {
		
    const userId = req.params === undefined ? req.user_id : req.params.user_id;
    const lineAccessToken = req.params === undefined ? req.access_token : req.params.access_token;
    
    const filter = {_id: userId, access_token: lineAccessToken};
    const user =  await User.findOne(filter);

    if (user === null) {
      prettyPrintResponse({filter, 'message': "Invalid user"});
      return;
    }
    const query = {wallet_id: user.dwolla.wallet.id};
    const transaction = await Transaction.find(query);

    return transaction

    
	} catch (err) {
		prettyPrintResponse(err);
	}
}