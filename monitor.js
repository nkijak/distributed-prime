var model = require('./model.js').Service;

var monitor;
var stats = {};
var systemStats = {clients:0, numLastSec:0, numProcessed:0,primesFound:0,time:0};

exports.createSocket = function(io) {
    monitor = 
        io.of('/monitor')
          .on('connection', function(socket) {
            socket.emit('clients', stats);

            socket.on('start', function() {

            });
            socket.on('stop', function() {

            });
      });
    
    model.on('computation', function (result) {
        systemStats.numProcessed += 1;
        if (result.isPrime) systemStats.primesFound += 1;
        monitor.emit('computation', systemStats);
    });

};

exports.newClient = function(id, description) {
    description = description || {};
//    model.addClient(id, description, function(err, numAdded) {
        stats[id] = {id:id,
                     description:description,
                     performance: { perSec: 0, average: 0}};
        systemStats.clients += 1;
        monitor.emit('new-client', stats[id]);
 //   });
};
