// app/routes.js


// routes =============================================
// ====================================================

// load model
var Task = require('./models/task');

// expose routes to app with module.exports
module.exports = function(app) {

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


}

