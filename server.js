var express = require('express'),
    path    = require('path');
var app = express();

var redis = require('redis').createClient();

var cons = require('consolidate');
app.engine('html', cons.jade);

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/number', function(req, res) {
    redis.incr('current-number', function(err, currentNumber) {
        var object = {'number':currentNumber};
        var body = JSON.stringify(object);
        res.setHeader('Content-Type', 'application/json');
        res.send(body);
    });
});

app.listen(3010);
console.log("Listening on port 3010");
