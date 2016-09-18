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
		successRedirect : '/tasksHome',	// redirect to secure homepage section
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
		successRedirect		: '/tasksHome',	// redirect to authenticated homepage
		failureRedirect		: '/signup',	// redirect back to signup page in case of error
		failureFlash		: true			// allow flash messages
	}));


	// ================================================
	// google auth routes =============================
	// ================================================
	app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
	
	// callback after google has authenticated user
	app.get('/auth/google/callback',
		passport.authenticate('google', {
			successRedirect : '/tasksHome',
			failureRedirect : '/'
		}));


	// ================================================
	// Authorization ==================================
	// - already logged in / connect with social account
	// ================================================

	// local ------------------------------------------
	app.get('/connect/local', function(req, res) {
		res.render('connectLocal.ejs', { message: req.flash('loginMessage') });
	});
	app.post('/connect/local', passport.authenticate('local-signup', {
		successRedirect : '/tasksHome', 	// redirect to secure profile section
		failureRedirect : '/connect/local',	// redirect back to signup page
		failureFlash	: true	// allow flash messages
	}));

	// google -----------------------------------------
	// send to google to do authentication
	app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

	// callback after google has authorized user
	app.get('/connect/google/callback',
		passport.authorize('google', {
			successRedirect : '/tasksHome',
			failureRedirect : '/'
		}));


	// ================================================
	// Unlink accounts ================================
	// - to unlink social accounts, just remove token
	// - for local, remove email and password
	// - user account stays active in case they want to reconnect in future
	// ================================================

	// local ------------------------------------------
	app.get('/unlink/local', function(req, res) {
		var user				= req.user;
		user.local.email		= undefined;
		user.local.password		= undefined;
		user.save(function(err) {
			res.redirect('/tasksHome');
		});
	});

	// google -----------------------------------------
	app.get('/unlink/google', function(req, res) {
		var user 			= req.user;
		user.google.token 	= undefined;
		user.save(function(err) {
			res.redirect('/tasksHome');
		});
	});


	// ================================================
	// Tasklist section ================================
	// ================================================
	// - want this protected so you have to be logged in first
	// - will use route middleware to verify this (via isLoggedIn function)
	app.get('/tasksHome', isLoggedIn, function(req, res) {
		res.render('tasksHome.ejs', {
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
	app.get('/api/tasks', isLoggedIn, function(req, res) {
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
	app.post('/api/tasks', isLoggedIn, function(req, res) {
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
	app.delete('/api/tasks/:task_id', isLoggedIn, function(req, res) {
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
		res.sendfile('./views/tasksHome.ejs');	// lead the single view file
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

