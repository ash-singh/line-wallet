const mongoose = require('mongoose');

const placidSchema = new mongoose.Schema({
  full_name: String,
  email: String,
  phone: String,
  access_token: String,
  item_id: String,
  address: {
    city: String,
    country: String,
    postal_code: String,
    region: String,
    street: String
  },
  account: {
    name: String,
    account: String,
    account_id: String,
    routing: String,
    wire_routing: String,
  }
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  access_token: String,
  verification_token: String,
  placid: placidSchema,
  dwolla: {
    customer: String,
    wallet: {
      id: String,
      funding_source: String,
      created:  String,
      source_type: String,
      name: String,
    }
  },
  is_verified: Boolean
});

module.exports.Placid = mongoose.model('Placid', placidSchema);
module.exports.User = mongoose.model('User', userSchema)