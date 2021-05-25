const {User, Placid} = require('../models/Model');
const {prettyPrintResponse, formatError} = require('../util');
const {app_name, plaid_products, plaid_redirect, plaid_country_codes} = require('../config');

const plaidClient = require('../libs/plaid/client');


const extractPlacidUserIdentity = (identities) => {
  var identity = identities[0];

  const addresses = identity.addresses;
  const emails = identity.emails;
  const phones = identity.phone_numbers;

  var userIdentity = {
    full_name: identity.names.join('')
  };

  for (let address of addresses) {
    if (address.primary == true) {
      userIdentity.address = address.data;
    }
  }

  for (let email of emails) {
    if (email.primary == true) {
      userIdentity.email = email.data;
    }
  }

  for (let phone of phones) {
    if (phone.primary == true) {
      userIdentity.phone = phone.data;
    }
  }

  return userIdentity;
}

const extractAccountIdentity = (data) => {
  
  const accounts = data.accounts;
  const routingAccounts = data.numbers.ach;

  var accountInfo = {};
  
  for (let routingAccount of routingAccounts) {
    for (let account of accounts) {
      if (account.account_id == routingAccount.account_id
        && account.subtype == 'savings') {
          accountInfo =  routingAccount;
          accountInfo.name = account.name;
          accountInfo.account_type = account.subtype;
      }
    }
  }

  return accountInfo;
}


// Create placid link token
exports.createLinkToken = async req => {
	try {
		
    const clientUserId = req.params === undefined ? req.user_id : req.params.user_id;
    const lineAccessToken = req.params === undefined ? req.access_token : req.params.access_token;

    const filter = {_id: clientUserId, access_token: lineAccessToken};
    const user = await User.findOne(filter);

    if (user === null) {
      prettyPrintResponse({filter, 'message': "Invalid user"});
      return;
    }

    const PLAID_PRODUCTS = (plaid_products).split(',',);
    const PLAID_COUNTRY_CODES = (plaid_country_codes).split(',',);
   
    const configs = {
      user: {
        client_user_id: clientUserId,
      },
      client_name: app_name,
      products: PLAID_PRODUCTS,
      country_codes: PLAID_COUNTRY_CODES,
      language: 'en',
    };
  
    if (plaid_redirect !== '') {
      configs.redirect_uri = plaid_redirect;
    }
    
    const createTokenResponse = await plaidClient.linkTokenCreate(configs);
    return createTokenResponse.data;
	} catch (err) {
		prettyPrintResponse(err);
	}
}

// Set plaid access token
exports.setAccessToken = async req => {
	try {
		
    const publicToken = req.params === undefined ? req.public_token : req.params.public_token;
    const userId = req.params === undefined ? req.user_id : req.params.user_id;
    const lineAccessToken = req.params === undefined ? req.access_token : req.params.access_token;

    const filter = {_id: userId, access_token: lineAccessToken};
    const user = await User.findOne(filter);

    if (user === null) {
      prettyPrintResponse({filter, 'message': "Invalid user"});
      return;
    }

    const tokenResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const placid = new Placid();
    placid.access_token = tokenResponse.data.access_token;
    placid.item_id = tokenResponse.data.item_id;

    const update = await User.findByIdAndUpdate(user._id, { 
      placid: placid
    }, {
      new: true,
      useFindAndModify: false
     });
    
    return update;
    
	} catch (err) {
    prettyPrintResponse(err);
	}
}

// Save user identity
exports.getUserIdentity = async req => {
	try {
		
    const userId = req.params === undefined ? req.user_id : req.params.user_id;
    const lineAccessToken = req.params === undefined ? req.access_token : req.params.access_token;

    const filter = {_id: userId, access_token: lineAccessToken};
    const user = await User.findOne(filter);

    if (user === null) {
      prettyPrintResponse({filter, 'message': "Invalid user"});
      return;
    }

    const identityResponse = await plaidClient.identityGet({
      access_token: user.placid.access_token,
    });

    const identities = identityResponse.data.accounts.flatMap(
      (account) => account.owners,
    );

    userIdentity = extractPlacidUserIdentity(identities);

    user.placid.address = userIdentity.address;
    user.placid.full_name = userIdentity.full_name;
    user.placid.email = userIdentity.email;
    user.placid.phone = userIdentity.phone;

    const newUser = await user.save();

    return newUser;
    
	} catch (err) {
    prettyPrintResponse(err);
	}
}

// Get account and routing information
exports.getAccountRoutingInfo = async req => {
	try {
		
    const userId = req.params === undefined ? req.user_id : req.params.user_id;
    const lineAccessToken = req.params === undefined ? req.access_token : req.params.access_token;

    const filter = {_id: userId, access_token: lineAccessToken};
    const user = await User.findOne(filter);

    if (user === null) {
      prettyPrintResponse({filter, 'message': "Invalid user"});
      return;
    }

    const authResponse = await plaidClient.authGet({ access_token: user.placid.access_token });
    
    const account = extractAccountIdentity(authResponse.data);
    
    user.placid.account = account;

    await user.save();
    return account;
    
	} catch (err) {
    prettyPrintResponse(err);
	}
}