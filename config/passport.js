// config/passport.js

// load
var LocalStrategy	 = require('passport-local').Strategy;
var GoogleStrategy	 = require('passport-google-oauth').OAuth2Strategy;

var User 			 = require('../app/models/user');	// load user model

// load auth vars
var configAuth = require('./auth');

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


	// ================================================
	// local login -----------------------------------
	// ================================================
	passport.use('local-login', new LocalStrategy ({
		// by default, local strategy uses username and password
		// overriding this to ouse email for username
		usernameField	: 'email',
		passwordField	: 'password',
		passReqToCallback	: true	// allows passing back entire request to callback
	},
	function(req, email, password, done) { 	// callback with email and password from form
		// find user with email = forms email
		// check to see if user is already logged in
		User.findOne({ 'local.email' : email }, function(err, user) {
			// if any errors, return them
			if (err)
				return done(err);

			// if no user found, return message
			if (!user)
				return done(null, false, req.flash('loginMessage', 'No user found.')); // req.falsh is way to set flashdata using connect-flash
		
			// if user is found but incorrect password
			if (!user.validPassword(password))
				return done(null, false, req.flash('loginMessage', 'Wrong password.'));	// create loginMessage and save it to session as flashdata
			
			// else, return authenticated user
			return done(null, user);

		});
	}));

	// ================================================
	// auth using google
	// ================================================
	passport.use(new GoogleStrategy ({

		// pull in app ID and secret from auth.js file
		clientID			: configAuth.googleAuth.clientID,
		clientSecret		: configAuth.googleAuth.clientSecret,
		callbackURL			: configAuth.googleAuth.callbackURL,
		passReqToCallback 	: true // allow passing in req from route, can now see if user logged in or not
	},
	// google sends back token and profile
	function(req, token, refreshToken, profile, done) {

		// should be asynchronous methods
		// User.findOne won't return until "all" data returned from Google
		process.nextTick(function() {
			//check if user already logged in
			if (!req.user) {
				// attempt finding user via google ID
				User.findOne({ 'google.id' : profile.id }, function(err, user) {
					if (err)
						return done(err);

					if(user) {

						// if user ID already exists but no token (user was linked previously)
						// then add token and profile info
						if(!user.google.token){
							
							user.google.token = token;
							user.google.name  = profile.name.givenName + ' ' + profile.name.familyName;
							user.google.email = profile.emails[0].value;
							
							user.save(function(err) {
								if (err)
									throw err;

								return done(null, user);
							});
						}

						// if user found, log them in
						return done(null, user);

					} else {

						// if user not in database, create new user
						var newUser	= new User();

						// set account information
						newUser.google.id 		= profile.id;
						newUser.google.token 	= token;
						newUser.google.name 	= profile.displayName;
						newUser.google.email 	= profile.emails[0].value; // get first email

						// save user
						newUser.save(function(err) {
							if (err)
								throw err;
							// if successful, return new user
							return done(null, newUser);
						});
					}
				});
			} else {

				// user already exists and is logged in
				// will link the accounts
				var user 	= req.user;	// pull user out of the session

				// update current users google creds
				user.google.id 		= profile.id;
				user.google.token 	= token;
				user.google.name 	= profile.name.givenName + ' ' + profile.name.familyName;
				user.google.email 	= profile.emails[0].value;

				// save user
				user.save(function(err) {
					if (err)
						throw err;

					return done(null, user);
				});
			} 
		});	
	}));

};




