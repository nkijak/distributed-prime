var CUTOFF_VALUE = 1000000;
var redis 	= require('redis').createClient(),
    EventEmitter   = require('events').EventEmitter,
    sys = require('sys');

function Service() {
}

sys.inherits(Service, EventEmitter);

Service.prototype.nextNumber = function(userId, success, failure) {
    redis.incr('current-number', function(err1, currentNumber) {
		redis.hset('user-numbers', userId, currentNumber, function(err2, reply) {
			if (currentNumber > CUTOFF_VALUE) {
                failure();
			} else {
                success(currentNumber);
			}
		});
    });
 };

Service.prototype.saveResults = function(userId, result, callback) {
    var self = this;
	redis.hdel('user-numbers', userId, function(err3, countDeleted) {
		redis.zadd(userId+"-processed", Date.now(), result.number);
		if (result.isPrime) {
			redis.zadd("prime-number", Date.now(), result.number);
			redis.zadd(userId+"-primes", Date.now(), result.number);
		}
        var eventValue = {userId:userId, number:result.number, isPrime:result.isPrime};
        self.emit('computation', eventValue); 
        callback();
	});
};

exports.Service = new Service();
