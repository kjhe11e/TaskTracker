// server.js


// set up =============================================
// ====================================================
var express = require('express');
var app = express();	// create app with express
var mongoose = require('mongoose');		// mongoose for mongodb
var morgan = require('morgan');		// log requests to the console (express4)
var bodyParser = require('body-parser');	// pull info from HTML POST (express4)
var methodOverride = require('method-override');	// simulate DELETE and PUT (express4)


// configuration ======================================
// ====================================================
mongoose.connect('mongodb://kylehelle:MarinersSeahawks@ds019796.mlab.com:19796/kjhe11e_test_mongodb');

app.use(express.static(__dirname + '/public'));		// set static files location /public/img will be /img
app.use(morgan('dev'));								// log each request to console
app.use(bodyParser.urlencoded({'extended': 'true'}));	// parse application/x-www-form-urlencoded
app.use(bodyParser.json());		// parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));		// parse application/vnd.api+json as json
app.use(methodOverride());

// models =============================================
// ====================================================
var Task = mongoose.model('Task', {
	text : String
});

// routes =============================================
// ====================================================

// api ------------------------------------------------
// GET all tasks
app.get('/api/tasks', function(req, res) {
	// use mongoose to get all tasks in database
	Task.find(function(err, tasks) {
		// if error retrieving, send the error
		// nothing after res.send(err) will execute
		if (err)
			res.send(err)

		res.json(tasks);	// return all tasks in JSON format
	});
});

// CREATE task and send back all tasks after creation
app.post('/api/tasks', function(req, res) {
	// create a task, info comes from AJAX request from Angular
	Task.create({
		text : req.body.text,
		done : false
	}, function(err, task) {
		if (err)
			res.send(err)

		// get and return all tasks after one is created
		Task.find(function(err, tasks) {
			if (err)
				res.send(err)

			res.json(tasks);
		});
	});
});

// DELETE a task
app.delete('/api/tasks/:task_id', function(req, res) {
	Task.remove({
		_id : req.params.task_id
	}, function(err, task) {
		if (err)
			res.send(err);

		// get and return all tasks after one is deleted
		Task.find(function(err, tasks) {
			if (err)
				res.send(err)

			res.json(tasks);
		});
	});
});

// application ----------------------------------------
app.get('*', function(req, res) {
	// angular will handle page changes on front-end
	res.sendfile('./public/index.html');	// lead the single view file
});


// listen on port, start app with 'node server.js' ====
// ====================================================
app.listen(8080);
console.log("Listening on port 8080");


