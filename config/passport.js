// config/passport.js

// load
var LocalStrategy	 = require('passport-local').Strategy;
var User 			 = require('../app/models/user');

// expose function to app via module.exports
module.exports = function(passport) {

	// =================================================
	// passport session setup: -------------------------
	// =================================================
	// required for persistent login sessions,
	// need to serialize and unserialize users with session

	// serialize user for session
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// deserialize user
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	// ================================================
	// local signup -----------------------------------
	// ================================================
	// by default, if no name, then is just named 'local'

	passport.use('local-signup', new LocalStrategy ({
		// by default, local strategy uses username + password,
		// wlll override this with email instead
		usernameField		: 'email',
		passwordField		: 'password',
		passReqToCallback	: true	// allows passing back entire request to callback  		
	},
	function(req, email, password, done) {
		// asynchronous
		// User.findOne not called unless data is returned
		process.nextTick(function() {
			// find user with email = forms email
			// check to see if user attempting login exists
			User.findOne({ 'local.email' : email }, function(err, user) {
				// if any error, return
				if (err)
					return done(err);

				// check if user exists with that email
				if (user) {
					return done(null, false, req.flash('signupMessage', 'Email already exists.'));
				} else {
					// if no user has that email, then create user
					var newUser = new User();

					// set user's local creds
					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);

					// save user
					newUser.save(function(err) {
						if (err)
							throw err;
						return done(null, newUser);
					});
				}
			});
		});
	}));


};
