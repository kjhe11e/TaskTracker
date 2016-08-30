// public/js/appRoutes.js
    
    angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
        })

        // about page that will use the AboutController
        .when('/about', {
            templateUrl: 'views/about.html',
            controller: 'AboutController'
        });

    $locationProvider.html5Mode(true);

}]);
