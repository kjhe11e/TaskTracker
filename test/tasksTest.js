// /test/tasksTest.js

var chai 		= require('chai');
var chaiHttp 	= require('chai-http');
var server 		= require('../server');
var should 		= chai.should();
var expect		= chai.expect;

chai.use(chaiHttp);

describe('Tasks', function() {
	it('should get all tasks on GET /api/tasks', function(done) {
		chai.request(server)
			.get('/api/tasks')
			.auth('kjhelle', 'pass')
			.end(function(err, res) {
				res.should.have.status(200);
				// *** more testing here ***
				//res.should.be.json;
				done();
			});
	});
});

