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

                //$.ajax('/number', {
                //    dataType:'json',
                //    success:function(data) {
                //            callback(data.number);
                //    },
                //    error:  err
                //});
            }

            function reportResult(result, callback) {
                number.isPrime = result.isPrime;
                number.$save(callback);
                //$.ajax('/number', {
                //    type:'POST',
                //    contentType:'application/json',
                //    data: JSON.stringify(result),
                //    success: callback
                //});
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
                if (!keepGoing) options.finish();        
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
    });


