self.addEventListener('message', function(event) {
    self.postMessage({'number':event.data, 'isPrime':isPrime(event.data)});
});

function isPrime(number) {
    var sqrt = Math.floor(Math.sqrt(number));
    for (var i = 2; i <= sqrt; i++) {
        if (number % i == 0) return false;
    }
    return true;
}
