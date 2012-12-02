var primordial = (function() {
    var worker = new Worker('/javascripts/primeCalculatorTask.js');
    var results = [];
    var options = {};
    var yield = function(){};

    function fetchNumber(err, callback) {
        $.ajax('/number', {
            dataType:'json',
            success:function(data) {
                    callback(data.number);
            },
            error:  err
        });
    }

    function reportResult(result, callback) {
        $.ajax('/number', {
            type:'POST',
            contentType:'application/json',
            data: JSON.stringify(result),
            success: callback
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
        reportResult(result, next);
    });

    function next() {fetchNumber(options.finish||function(){}, calculate); }

    return {
        next: next,
        results: results,
        yieldTo: function(callback) { yield = callback; },
        handlers: function(handlers) { options = handlers; }
    };
})();