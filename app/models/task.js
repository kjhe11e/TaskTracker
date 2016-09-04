// app/models/task.js

// load mongoose, need it to define a model
var mongoose = require('mongoose');

module.exports = mongoose.model('Task', {
	text : String
});

