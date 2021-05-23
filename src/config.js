const dotenv = require('dotenv')
dotenv.config();

module.exports = {
    port: process.env.PORT,
    app_name: process.env.APP_NAME,

    mongo_uri: process.env.MONGO_URI,

    sib_api_key: process.env.SIB_API_KEY,

    plaid_client_id: process.env.PLAID_CLIENT_ID,
    plaid_secret: process.env.PLAID_SECRET,
    plaid_env: process.env.PLAID_ENV || 'sandbox',
    plaid_country_codes: process.env.PLAID_COUNTRY_CODES,
    plaid_products: process.env.PLAID_PRODUCTS,
    plaid_redirect: process.env.PLAID_REDIRECT_URI,
}
