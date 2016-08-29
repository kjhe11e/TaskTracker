// app/routes.js

// grab the 'about' model
var About = require('./models/about');

module.exports = function(app) {
	//server routes ================================
	// handle things like API calls here
	// authentication routes

	// sample API route
	app.get('/api/aboutInfo', function(req, res) {
		// use Mongoose to get all about information
		About.find(function(err, aboutInfo) {
			// if there is an error retrieving, send the error
			// nothing after res.send(err) will execute
			if (err)
				res.send(err);

			res.json(aboutInfo);	// return all aboutInfo in JSON format
		});
	});

	// route to handle creating goes here (app.post)
	// route to handle delete goes here (app.delete)

	// frontend routes =============================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendfile('./public/views/index.html');	// load public/index.html file 
	});


};
