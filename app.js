
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var objects = require('./routes/objects');
var http = require('http');
var path = require('path');
// var _ = require('underscore');

// Database
var mongo = require('mongoskin');
var db = mongo.db([
    'localhost:27017/?auto_reconnect'
    ], {
        database: 'bgpoint',
        safe: true
    }
);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// GET
app.get('/', routes.root);
app.get('/index', checkAuth, routes.index);
// app.get('/users', user.list);
app.get('/login', user.login);
app.get('/logout', user.logout);
app.get('/objects', checkAuth, objects.fetch(db));

// POST
app.post('/login_submit', user.login_submit(db));
app.post('/objects', checkAuth, objects.create(db));

// DELETE
app.delete('/objects/:id', checkAuth, objects.delete(db));

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

// other functions
function checkAuth(req, res, next) {
	if (!req.session.user_id) {
		res.redirect('login');
	} else {
		next();
	}
}