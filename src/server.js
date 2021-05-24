const express = require('express');
const mongoose = require('mongoose');
const { mongo_uri } = require('./config');
const morgan = require('morgan')
const path = require('path')
const rfs = require('rotating-file-stream') 

// Connect to DB
mongoose
	.connect(mongo_uri, {useUnifiedTopology: true, useNewUrlParser: true})
	.then(() => console.log('MongoDB connected...'))
	.catch(err => console.log(err))

var app = express()

// create a rotating write stream
var accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, '../logs')
})

// log to 
app.use(morgan('combined', { stream: accessLogStream }))

// log only 4xx and 5xx responses to console
app.use(morgan('dev', {
	skip: function (req, res) { return res.statusCode < 400 }
}))

module.exports = app;

