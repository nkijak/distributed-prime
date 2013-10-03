angular.module('myApp', ['ngRoute', 'app.homePages', 'app.statsPages'])

  .constant('TPL_PATH', './templates')

  .config(function($routeProvider, TPL_PATH) {
    $routeProvider
        .when('/',{
          controller : 'HomeCtrl',
          templateUrl : TPL_PATH + '/home.html'
        })
        .when('/stats', {
            controller: 'StatsCtrl',
            templateUrl: TPL_PATH + '/stats.html'
        });
  });
