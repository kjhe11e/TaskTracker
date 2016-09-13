// server.js


// set up =============================================
// ====================================================
var express = require('express');
var database = require('./config/database');	// load database
var app = express();	// create app with express
var mongoose = require('mongoose');		// mongoose for mongodb
var morgan = require('morgan');		// log requests to the console (express4)
var bodyParser = require('body-parser');	// pull info from HTML POST (express4)
var cookieParser = require('cookie-parser');
var session = require('express-session');
var methodOverride = require('method-override');	// simulate DELETE and PUT (express4)
var passport = require('passport');
var flash = require('connect-flash');
var port = process.env.PORT || 8080;	// set the port

// configuration ======================================
// ====================================================
mongoose.connect(database.url);

require('./config/passport')(passport);	// pass passport for configuration

app.use(express.static(__dirname + '/public'));		// set static files location /public/img will be /img
app.use(morgan('dev'));								// log each request to console
app.use(bodyParser.urlencoded({'extended': 'true'}));	// parse application/x-www-form-urlencoded
app.use(cookieParser());	// read cookies (needed for authentication)
app.use(bodyParser());	// get info from html forms
app.use(bodyParser.json());		// parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));		// parse application/vnd.api+json as json
app.use(methodOverride());

app.set('view engine', 'ejs');		// set up ejs for templating

// required for passport
app.use(session({ secret: 'asd!u89h38923%&#$@!SLKJDFh8932asdfu89h' }));	//session secret
app.use(passport.initialize());
app.use(passport.session());	// for persistent login sessions
app.use(flash());	// use connect-flash for flash messages stored in session


// load routes
require('./app/routes.js')(app, passport);	// load routes and pass in app with fully config'd passport


// listen on port, start app with 'node server.js' ====
// ====================================================
app.listen(port);
console.log("Listening on port " + port);


