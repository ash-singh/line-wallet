const boom = require('boom');
const User = require('../models/User');
const {prettyPrintResponse, formatError} = require('../util');
const {app_name, plaid_products, plaid_redirect, plaid_country_codes} = require('../config');

const plaidClient = require('../libs/plaid/client');

exports.createLinkToken = async req => {
	try {
		
    const clientUserId = req.params === undefined ? req.user_id : req.params.user_id;

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
		throw boom.boomify(err);
	}
}

exports.setAccessToken = async req => {
	try {
		
    const publicToken = req.params === undefined ? req.public_token : req.params.public_token;
    const userId = req.params === undefined ? req.user_id : req.params.user_id;

    const tokenResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const update = await User.findByIdAndUpdate(userId, { 
      placid_access_token: tokenResponse.data.access_token, 
      placid_item_id: tokenResponse.data.item_id}, {
      new: true,
     });
    
    prettyPrintResponse(update)
    return update;
    
	} catch (err) {
		throw boom.boomify(err);
	}
}

exports.setAccessToken = async req => {
	try {
		
    const publicToken = req.params === undefined ? req.public_token : req.params.public_token;
    const userId = req.params === undefined ? req.user_id : req.params.user_id;

    const tokenResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const update = await User.findByIdAndUpdate(userId, { 
      placid_access_token: tokenResponse.data.access_token, 
      placid_item_id: tokenResponse.data.item_id}, {
      new: true,
     });
    
    return update;
    
	} catch (err) {
    throw boom.boomify(err);
	}
}

exports.getUserIdentity = async req => {
	try {
		
    const userId = req.params === undefined ? req.user_id : req.params.user_id;

    const user = await User.findById(userId);

    const identityResponse = await plaidClient.identityGet({
      access_token: user.placid_access_token,
    });

    const identities = identityResponse.data.accounts.flatMap(
      (account) => account.owners,
    );
    prettyPrintResponse(identities);

    return identities;
    
	} catch (err) {
    formatError(err);
		throw boom.boomify(err);
	}
}

exports.getAccountRoutingInfo = async req => {
	try {
		
    const userId = req.params === undefined ? req.user_id : req.params.user_id;

    const user = await User.findById(userId);

    const authResponse = await plaidClient.authGet({ access_token: user.placid_access_token });
    
    return authResponse.data.numbers.ach;
    
	} catch (err) {
    formatError(err);
		throw boom.boomify(err);
	}
}