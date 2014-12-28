/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

var fs = require('fs');
var url = require('url');
var path = require('path');
var express = require('express');
var ReactTools = require('react-tools');

// Configure JSX Harmony transform in order to be able
// require .js files with JSX
var jsExt = require.extensions['.js'];
require.extensions['.js'] = function(module, filename) {
  if (filename.indexOf('node_modules') === -1) {
    var src = fs.readFileSync(filename, {encoding: 'utf8'});
    src = ReactTools.transform(src, {harmony: true, stripTypes: true});
    module._compile(src, filename);
  } else {
    jsExt(module, filename);
  }
};

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(path.join(__dirname, '../build')));

//// Make .html extension optional
//app.use(function(req, res, cb) {
//  var uri = url.parse(req.url);
//  var filename = path.join(__dirname, 'public', uri.pathname);
//  if (uri.pathname.length > 1 &&
//    uri.pathname.lastIndexOf('/browser-sync/', 0) !== 0 &&
//    !fs.existsSync(filename)) {
//    if (fs.existsSync(filename + '.html')) {
//      req.url = '/public' + uri.pathname + '.html' + (uri.search || '');
//    } else {
//      res.statusCode = 404;
//      req.url = '/public/404.html' + (uri.search || '');
//    }
//  }
//  cb();
//});

app.get('/hello', function(request, response) {
  response.send('Hello World!');
});

app.use(function(req, res) {
  res.status(404);

  if (req.accepts('html')) {
    res.sendFile(__dirname + '/404.html');
  } else if (req.accepts('json')) {
    res.send({ error: 'Not found' });
  } else {
    res.type('txt').send('Not found');
  }
});

app.listen(app.get('port'), function() {
  var message = 'Node app is running at http://localhost:' + app.get('port') + '/';
  console.log(message);
  if (process.send) {
    process.send({type: 'start', message: message});
  }
});

module.exports = app;
