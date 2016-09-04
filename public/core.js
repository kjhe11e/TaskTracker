// public/core.js

var taskList = angular.module('taskList', []);

function mainController($scope, $http) {
	$scope.formData = {};

	// when landing on tasks page, get all tasks and show them
	$http.get('/api/tasks')
		.success(function(data) {
			$scope.todos = data;
			console.log(data);
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	// when submitting the add form, send the text to the node API
	$scope.createTask = function() {
		$http.post('/api/tasks', $scope.formData)
			.success(function(data) {
				$scope.formData = {}; 	// clear form so user is ready to enter another
				$scope.tasks = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	// delete a task after checking it
	$scope.deleteTask = function(id) {
		$http.delete('/api/tasks/' + id)
			.success(function(data) {
				$scope.tasks = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
	
}
