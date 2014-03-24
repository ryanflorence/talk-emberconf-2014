
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var app = express();

var arDrone = require('ar-drone');
var drone = arDrone.createClient();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(allowCors);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var actions = [
  'takeoff',
  'land',
  'up',
  'down',
  'clockwise',
  'counterClockwise',
  'front',
  'back',
  'left',
  'right',
  'stop'
];

app.all('/action', function(req, res) {
  var action = req.body.action;
  var value = req.body.value;
  if (actions.indexOf(action) == -1) {
    return res.json(500, {msg: 'unknown action: ' + action});
  }
  console.log(action, value);
  drone[action].call(drone, value);
  res.json({action: action, value: value});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

function allowCors(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
}
