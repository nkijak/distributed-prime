angular.module("app.services", ["ngResource"])

    .factory('NumberService', function($resource) {
      return $resource('/number');
    })

    .factory("Primordial", function(NumberService) {

        return function() {
            
            var worker = new Worker('./scripts/primeCalculatorTask.js');
            var results = [];
            var options = {};
            var yield = function(){};
            var keepGoing = true;
            var number = {};

            function fetchNumber(err, callback) {
                number = NumberService.get(function() {
                    callback(number.number);
                });
            }

            function reportResult(result, callback) {
                number.isPrime = result.isPrime;
                number.$save(callback);
            }

            function calculate(number) {
                worker.postMessage(number);
            }
            
            worker.addEventListener('message', function(e) {
                var result = e.data;
                results.push(result);        
                yield(result);
                reportResult(result, next);
            });

            function next() {
                if (!keepGoing) (options.finish||function(){})();        
                else fetchNumber(options.finish||function(){}, calculate);
            }

            function stop() { keepGoing = false; }
            function start() { keepGoing = true; next(); }
            return {
                next: next,
                results: results,
                yieldTo: function(callback) { yield = callback; },
                handlers: function(handlers) { options = handlers; },
                stop: stop,
                start: start
            };
        };

    })

    .factory("Stats", function() {
        return function($scope) {

            var worker = new Worker('./scripts/statsCalculatorTask.js');
            worker.addEventListener('message', function(event){
                lastPublishedStats = event.data;
                var secondsSinceStart = lastPublishedStats.thresholds.all.length;
                var numPerSec = lastPublishedStats.thresholds.all[Math.max(secondsSinceStart-2,0)];
                var avg = Math.round(lastPublishedStats.count/secondsSinceStart);
                $scope.$broadcast("statsUpdate", numPerSec, avg); 
            });
    
            return {
                start: function() {
                    worker.postMessage({'operation':'start'});
                },
                end: function(dataHandler) {
                    worker.addEventListener('message', dataHandler);
                    worker.postMessage({'operation':'stop'});
                },
                log: function(data) {
                    worker.postMessage({'operation':'log',
                                        'data' : data});
                }
            };
        };
    })
;

