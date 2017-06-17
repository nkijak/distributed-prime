var express = require('express'),
    path    = require('path'),
    cons    = require('consolidate'),
    uuid	= require('node-uuid'),
    model   = require('./model.js').Service,
    monitor = require('./monitor.js');
var app = express();
// Socket.io setup
var httpServer = require('http').createServer(app),
    io         = require('socket.io').listen(httpServer);

monitor.createSocket(io);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(function(req, res, next) {
    var userId = req.cookies.uuid;
    if (!userId) {
      userId = uuid.v1();
      res.cookie('uuid', userId,{maxAge: 90000000}); 
    }
    req.userId = userId;
    next();
  });
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/number', function(req, res) {
  model.nextNumber(req.userId, function success(currentNumber) {
    var object = {'number':currentNumber};
    var body = JSON.stringify(object);
    res.setHeader('Content-Type', 'application/json');
    res.send(body);
  },function failure() {
    res.writeHead(503);
    res.end();
  });
});

app.get('/stats', function(req, res) {
  res.render('stats');
});

app.post('/number', function(req, res) {
  model.saveResults(req.userId, req.body, function() {
    res.writeHead(204);
    res.end();
  });
});

//======== socket.io =========
io.sockets.on('connection', function(socket) {
  socket.on('id', function(data) {
    console.log("registration, id = %s", data.id);
    socket.set('userId', data.id, function(){
      monitor.newClient(data.id);
      socket.emit('ready');	
    });
  });
  socket.on('next-number', function(data) {
    socket.get('userId', function (err, userId) {
      model.nextNumber(userId, function success(currentNumber) {
        socket.emit('next-number', {'number':currentNumber});
      }, function failure() {
        socket.emit('complete');
      });
    });
  });
  socket.on('result', function(data) {
    socket.get('userId',function(err, userId) {
      model.saveResults(userId, data, function() {});
    });
  });
});


httpServer.listen(3010);
console.log("Listening on port 3010");
