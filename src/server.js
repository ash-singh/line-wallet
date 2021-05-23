const express = require('express');
const mongoose = require('mongoose');

// Connect to DB
mongoose
	.connect('mongodb://0.0.0.0:27019/line')
	.then(() => console.log('MongoDB connected...'))
	.catch(err => console.log(err))
  
module.exports = express();