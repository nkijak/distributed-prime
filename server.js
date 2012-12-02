function CUTOFF_VALUE() { return 1000000; }

var express = require('express'),
    path    = require('path'),
	cons    = require('consolidate'),
	redis 	= require('redis').createClient();
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/number', function(req, res) {
    redis.incr('current-number', function(err, currentNumber) {
		if (currentNumber > CUTOFF_VALUE()) {
			res.writeHead(503);
			res.end();
		} else {
			var object = {'number':currentNumber};
			var body = JSON.stringify(object);
			res.setHeader('Content-Type', 'application/json');
			res.send(body);
		}
    });
});

app.get('/stats', function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify({'status':'complete'}));
});

app.post('/number', function(req, res) {
	console.log(req.body);
	if (req.body.isPrime) {
		redis.zadd("prime-number", req.body.number, req.body.number);
	}
	res.writeHead(204);
	res.end();
});

app.listen(3010);
console.log("Listening on port 3010");
