// server.js


// modules =========================================
// =================================================
var express			= require('express');
var app				= express();
var bodyParser		= require('body-parser');
var methodOverride	= require('method-override');
var mongoose = require('mongoose');
mongoose.connect('mongodb://kylehelle:seattle@ds019796.mlab.com:19796/kjhe11e_test_mongodb');


// configuration ===================================
// =================================================

// config files
var db = require('./config/db');

// set port to use
var port = process.env.PORT || 8080;

// connect to mongoDB database
// (uncomment after entering credentials in config/db.js)
// mongoose.connect(db.url);

// get all data/stuff of body POST parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. Simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));


// TaskSchema for MongoDB ==========================
// =================================================
var Task = require('./app/models/task');


// routes for the API ==================================
// =================================================
var router = express.Router();	// get an instance of express router

// middleware to use for all requests
router.use(function(req, res, next) {
	// log here
	console.log('Request made');
	next();	// go to the next routes and don't stop here
});

// test route to make sure everything is working correctly,
// accessed at GET http://localhost:8080/api
router.get('/', function(req, res) {
	res.json({ message: 'Welcome to the API' });
});

// *** add more routers for API here

// routes that end in /tasks
// -------------------------------------------------
router.route('/tasks')
	// create a task (accessed at POST http://localhost:8080/api/tasks)
	.post(function(req, res) {
		var task = new Task();	// create new instance of Task model
		task.name = req.body.name;	// set task's name from request

		// save the task and check for errors
		task.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Task created' });
		});
	})

	// get all tasks (accessed at GET http://localhost:8080/api/tasks)
	.get(function(req, res) {
		Task.find(function(err, tasks) {
			if (err)
				res.send(err);

			res.json(tasks);
		});
	});



// register routes ---------------------------------
// all routes will be prefixed with /api
app.use('/api', router);


// start app =======================================
// =================================================

// startup app at http://localhost:8080
app.listen(port);

// shoutout to the user
console.log('Data on port ' + port);

// expose app
exports = module.exports = app;
