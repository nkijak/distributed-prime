var model = require('./model.js');

var monitor;
var stats = {};

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


};

exports.newClient = function(id, description) {
    description = description || {};
//    model.addClient(id, description, function(err, numAdded) {
        stats[id] = {id:id,
                     description:description,
                     performance: { perSec: 0, average: 0}};
        monitor.emit('new-client', stats[id]);
 //   });
};
