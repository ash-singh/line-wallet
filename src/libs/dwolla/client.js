const { dwolla_app_key, dwolla_app_secret, dwolla_env } = require('../../config');

const Client = require("dwolla-v2").Client;

const dwolla = new Client({
  key: dwolla_app_key,
  secret: dwolla_app_secret,
  environment: dwolla_env, // defaults to 'production'
});


module.exports = dwolla