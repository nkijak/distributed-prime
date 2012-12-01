var primordial = (function() {
    var worker = new Worker('/javascripts/primeCalculatorTask.js');
    var results = [];
    var yield = function(){};

    function fetchNumber(err, callback) {
        $.getJSON('/number', function(data) {
            callback(data.number);
        });
    }

    function calculate(number) {
        console.log("Being asked to calculate on %d", number);
        worker.postMessage(number);
    }
    
    worker.addEventListener('message', function(e) {
        var result = e.data;
        console.log("message received %o", e);
        console.log("%d is prime? %s", result.number, result.isPrime);
        results.push(result);        
        yield(result);
        next();
    });

    function next() {fetchNumber(null, calculate); }

    return {
        next: next,
        results: results,
        yieldTo: function(callback) { yield = callback; }
    };
})();