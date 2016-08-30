// public/js/services/AboutService.js

angular.module('AboutService', []).factory('About', ['$http', function($http) {
	return {
		
		// call to get all about info
		get : function() {
			return $http.get('/api/about');
		},

		// will work when more API routes are defined on Node end
		// call to POST and create new About info
		create : function(aboutData) {
			return $http.post('/api/about', aboutData);
		},

		// call to DELETE an aboutInfo
		delete : function(id) {
			return $http.delete('/api/about/' + id);
		}

	}
}]);
