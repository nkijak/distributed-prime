self.addEventListener('message', function(event) {
    switch(event.data.operation) {
        case "start": 
            start();
            break;
        case "log":   
            log(event.data.data);
            break;
        case "stop":   
            stop();
            break;
        default:
            throw "Stats worker received unknown command. DOING NOTHING.";
   }
});

var stats = {};

function $T(){ return new Date().getTime();}

function start() {
    var now = $T();
    stats.start = now;
    stats.lastNumberAt = now;
    stats.primes = [];
    stats.thresholds = {};
    stats.thresholds.primes = [];
    stats.thresholds.all = [];
    stats.count = 0;
}

function stop() {
    stats.end = $T();
    self.postMessage(stats);
    self.close();
}

function log(data) {
    var now = $T();
    var bucket = Math.floor((now - stats.start)/1000);
    //throw JSON.stringify([now, bucket, stats.start, now-stats.start, (now-stats.start)/1000]);
    fill(stats.thresholds.all, bucket, 0);
    stats.thresholds.all[bucket]+=1;
    if (data.isPrime) {
        fill(stats.thresholds.primes, bucket, 0);
        stats.thresholds.primes[bucket]+=1;
    }
    stats.count+=1;
}

function fill(array, newLength, fillValue) {
    for(var i = array.length; i < newLength;i++) array[i] = fillValue;
    if(!array[newLength]) array[newLength] = fillValue;
}
        
