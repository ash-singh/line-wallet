const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const { plaid_client_id, plaid_secret, plaid_env } = require('../../config');

const configuration = new Configuration({
  basePath: PlaidEnvironments[plaid_env],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': plaid_client_id,
      'PLAID-SECRET': plaid_secret,
      'Plaid-Version': '2020-09-14',
    },
  },
});

module.exports = new PlaidApi(configuration);