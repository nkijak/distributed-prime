angular.module('app.homePages', ['app.services'] )

  .controller('HomeCtrl', function($scope, Primordial) {
    var primordial = new Primordial();
    //TODO convert primordial to be event based
    primordial.yieldTo(function(result) {
        if (result.isPrime) {
            addPrime(result.number);
        }
        //TODO turn this into a directive?
        $scope.status = result.number + " is " + (result.isPrime?"":"not ") + "prime.";
    });
    //initial state
    $scope.running = false;      
    $scope.primes = [];
    $scope.go = function() {
        $scope.running = true;
        primordial.start();
    }
    $scope.stop = function() {
        $scope.running = false;
        primordial.stop();
    }
    
    function addPrime(number) {
       if ($scope.primes.length == 5) { $scope.primes.shift(); }
       $scope.primes.push(number);
    }
  });
