// app/routes.js


// routes =============================================
// ====================================================

// load model
var Task = require('./models/task');

// expose routes to app with module.exports
module.exports = function(app, passport) {


	// ================================================
	// Home page (with login link) ====================
	// ================================================
	app.get('/', function(req, res) {
		res.render('authBase.ejs');	// load the authBase.ejs file
	});


	// ================================================
	// Login page =====================================
	// ================================================	
	app.get('/login', function(req, res) {
		// render page and pass in any flash data if exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});


	// process login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/index',	// redirect to secure profile section
		failureRedirect : '/login', // redirect back to signup page if there is an error 
		failureFlash	: true	// allow flash messages
	}));


	// ================================================
	// Signup =========================================
	// ================================================
	app.get('/signup', function(req, res) {
		// render page and pass in any flash data if exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});


	// process signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect		: '/index',	// redirect to authenticated homepage
		failureRedirect		: '/signup',	// redirect back to signup page in case of error
		failureFlash		: true			// allow flash messages
	}));


	// ================================================
	// Profile section ================================
	// ================================================
	// - want this protected so you have to be logged in first
	// - will use route middleware to verify this (via isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('index.html', {
			user : req.user	// get user out of session and pass to template
		});
	});


	// ================================================
	// Logout =========================================
	// ================================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});


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
		res.sendfile('./views/index.html');	// lead the single view file
	});

};


// route middleware to make sure user is logged in
function isLoggedIn(req, res, next) {
	
	// if user is authenticated in session, carry on
	if(req.isAuthenticated())
		return next();
	
	// if they aren't authenticated, then redirect to home (authBase) page
	res.redirect('/');
}

