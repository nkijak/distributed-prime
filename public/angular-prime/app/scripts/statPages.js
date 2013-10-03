angular.module("app.statsPages", [])
    .controller("StatsCtrl", function($scope) {
       $scope.stats = {'clients': 0, 'numProcessed': 0, 'primesFound': 0}; 
    });

