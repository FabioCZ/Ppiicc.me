'use strict';

// Declare app level module which depends on views, and components
var picmeApp = angular.module('picmeApp', ['picmeApp.controllers', 'picmeApp.services', 'ngRoute']);

picmeApp = picmeApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider
			.when('/picture', {
				templateUrl: 'picture/template.html',
				controller: 'PictureCtrl'
			})

			.when('/matches', {

				templateUrl: 'matches/template.html',
				controller: 'MatchesCtrl'
			})

			.otherwise({
				redirectTo: '/'
			});

}]);

// Register Services and Controllers
// (maintaining some compability with mobile app)
var picmeServices = angular.module('picmeApp.services', '[]');
var picmeControllers = angular.module('picmeApp.controllers', '[]');