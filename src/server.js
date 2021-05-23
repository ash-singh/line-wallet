const express = require('express');
const mongoose = require('mongoose');
const { mongo_uri } = require('./config');

const plaidClient = require('./libs/plaid/client');

// Connect to DB
mongoose
	.connect(mongo_uri)
	.then(() => console.log('MongoDB connected...'))
	.catch(err => console.log(err))
  
module.exports = express();

