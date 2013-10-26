
/**
 * Static Server
 */

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', 8000);
app.use(express.logger('dev'));
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.errorHandler());

http.createServer(app).listen(app.get('port'), function(){
  console.log('Static Server on: ' + app.get('port'));
});
