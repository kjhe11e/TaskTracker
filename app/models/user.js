// app/models/user.js

// load
var  mongoose 	= require('mongoose');
var bcrypt		= require('bcrypt-nodejs');

// define schema for user model
var userSchema = mongoose.Schema({

	local			: {
		email		: String,
		password	: String,
	},
	google			: {
		id			: String,
		token		: String,
		email		: String,
		name		: String
	}
});

// methods ============================================
// generate hash
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// check password validation
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

// export user model
module.exports = mongoose.model('User', userSchema);
