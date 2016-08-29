// app/models/about.js
// grab the mongoose module
var mongoose = require('mongoose');

// define the 'about' model
// module.exports allows us to pass this to other files when called
module.exports = mongoose.model('About', {
	name : {type : String, default: ''}
});
