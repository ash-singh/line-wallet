const dotenv = require('dotenv')
dotenv.config();

module.exports = {
    port: process.env.PORT,
    mongo_uri: process.env.MONGO_URI,
    sib_api_key: process.env.SIB_API_KEY
}