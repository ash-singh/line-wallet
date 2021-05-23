const boom = require('boom');
const User = require('../models/User');
const {prettyPrintResponse} = require('../util');
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
    
    try {
      const createTokenResponse = await plaidClient.linkTokenCreate(configs);
      return createTokenResponse.data;
    } catch (error) {
      prettyPrintResponse(error);
    }
	} catch (err) {
		throw boom.boomify(err);
	}
}