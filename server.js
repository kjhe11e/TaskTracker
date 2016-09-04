// server.js


// set up =============================================
// ====================================================
var express = require('express');
var database = require('./config/database');	// load database
var app = express();	// create app with express
var mongoose = require('mongoose');		// mongoose for mongodb
var morgan = require('morgan');		// log requests to the console (express4)
var bodyParser = require('body-parser');	// pull info from HTML POST (express4)
var methodOverride = require('method-override');	// simulate DELETE and PUT (express4)
var port = process.env.PORT || 8080;	// set the port

// configuration ======================================
// ====================================================
mongoose.connect(database.url);

app.use(express.static(__dirname + '/public'));		// set static files location /public/img will be /img
app.use(morgan('dev'));								// log each request to console
app.use(bodyParser.urlencoded({'extended': 'true'}));	// parse application/x-www-form-urlencoded
app.use(bodyParser.json());		// parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));		// parse application/vnd.api+json as json
app.use(methodOverride());

// load routes
require('./app/routes.js')(app);


// listen on port, start app with 'node server.js' ====
// ====================================================
app.listen(8080);
console.log("Listening on port 8080");


