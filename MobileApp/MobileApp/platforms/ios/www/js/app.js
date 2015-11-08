// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'picmeApp.controllers', 'picmeApp.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
      .state('tab', {
          url: "/tab",
          abstract: true,
          templateUrl: "templates/tabs.html"
      })

        .state('tab.pictures', {
            url: '/pictures',
            views: {
                'tab-pictures': {
                    templateUrl: 'templates/tab-pictures.html',
                    controller: 'PictureCtrl'
                }
            }
        })

        .state('tab.matches', {
            url: '/matches',
            views: {
                'tab-matches': {
                    templateUrl: 'templates/tab-matches.html',
                    controller: 'MatchCtrl'
                }
            }
        })

    .state('tab.user', {
        url: '/user',
        views: {
            'tab-user': {
                templateUrl: 'templates/user.html',
                controller: 'UserCtrl'
            }
        }
    })
      .state('tab.musuems', {
          url: '/museums',
          views: {
              'tab-museums': {
                  templateUrl: 'templates/tab-museums.html',
                  controller: 'MuseumCtrl'
              }
          }
      });
    /*
    .state('tab.account', {
        url: '/account',
        views: {
            'tab-account': {
                templateUrl: 'templates/tab-account.html',
                controller: 'AccountCtrl'
            }
        }
    });
    */
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/user');

});

// Register the Controller and Services module
// Maintains some compatability with the web app
var picmeServices = angular.module('picmeApp.services', []);
var picmeControllers = angular.module('picmeApp.controllers', [])