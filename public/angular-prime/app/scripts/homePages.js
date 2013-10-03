angular.module('app.homePages', ['app.services', 'app.directives'] )

  .controller('HomeCtrl', function($scope, Primordial, Stats) {
    var primordial = new Primordial();
    var stats = new Stats($scope);

    //TODO convert primordial to be event based
    primordial.yieldTo(function(result) {
        stats.log(result);
        if (result.isPrime) {
            addPrime(result.number);
        }
        //TODO turn this into a directive?
        $scope.status = result.number + " is " + (result.isPrime?"":"not ") + "prime.";
    });
    //initial state
    $scope.running = false;      
    $scope.primes = [];
    
    //listeners
    $scope.$on('statsUpdate', function(event) {
        this.count = (this.count || 0);
        this.count += 1;
        $scope.perSecond = arguments[1];
        $scope.avg = arguments[2];
        if(this.count % 100 == 0) console.log($scope.perSecond,$scope.avg);
    });


    //actions
    $scope.go = function() {
        $scope.running = true;
        stats.start();
        primordial.start();
    }
    $scope.stop = function() {
        $scope.running = false;
        stats.end();
        primordial.stop();
    }
    
    function addPrime(number) {
       if ($scope.primes.length == 5) { $scope.primes.shift(); }
       $scope.primes.push(number);
    }
  });
