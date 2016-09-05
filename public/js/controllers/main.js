// js/controllers/main.js

angular.module('taskController', [])

	// inject the Task service factory into controller
	.controller('mainController', function($scope, $http, Tasks) {
		$scope.formData = {};

		// GET ========================================
		// when lading on the page, get and show all tasks
		// use the service to get all tasks
		Tasks.get()
			.success(function(data) {
				$scope.tasks = data;
			});

		// CREATE =====================================
		// when submitting the add form, send the text to the node API
		$scope.createTask = function() {
            // validate formData to ensure not null
            // if form is empty, nothing should happen
            // block from submitting same task multiple times when holding ENTER
            if (!$.isEmptyObject($scope.formData)) {

                // call the create function from the service, returns a promise object
                Tasks.create($scope.formData)

                    // if success, call get function to return all tasks
                    .success(function(data) {
                        $scope.formData = {}; // clear so user can enter another task
                        $scope.tasks = data; // assign new list of tasks
                    });
            }
        };

		// DELETE =====================================
		// delete a task after checking it
		$scope.deleteTask = function(id) {
			Tasks.delete(id)
				// if successful, get and return all current tasks
				.success(function(data) {
					$scope.tasks = data;	// assign new list of tasks
				});
		};
	});
	