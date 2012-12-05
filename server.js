function CUTOFF_VALUE() { return 1000000; }

var express = require('express'),
    path    = require('path'),
	cons    = require('consolidate'),
	redis 	= require('redis').createClient(),
	uuid	= require('node-uuid'),
    model   = require('./model.js');
var app = express();
// Socket.io setup
var httpServer = require('http').createServer(app),
    io         = require('socket.io').listen(httpServer);

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
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify({'status':'complete'}));
});

app.post('/number', function(req, res) {
	redis.hdel('user-numbers', req.userId, function(err3, count) {
		redis.zadd(req.userId+"-processed", Date.now(), req.body.number);
		if (req.body.isPrime) {
			redis.zadd("prime-number", Date.now(), req.body.number);
			redis.zadd(req.userId+"-primes", Date.now(), req.body.number);
		}
		res.writeHead(204);
		res.end();
	});
});

//======== socket.io =========
io.sockets.on('connection', function(socket) {
    socket.on('get-number', function(data) {
        console.log(socket, data);
    });
});

httpServer.listen(3010);
console.log("Listening on port 3010");
