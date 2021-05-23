const express = require('express');
const mongoose = require('mongoose');
const { mongo_uri } = require('./config');

// Connect to DB
mongoose
	.connect(mongo_uri)
	.then(() => console.log('MongoDB connected...'))
	.catch(err => console.log(err))
  
module.exports = express();

