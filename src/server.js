/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var express = require('express');
var React = require('react');
var ReactTools = require('react-tools');

// Set global variables
global.__DEV__ = process.env.NODE_ENV == 'development';
global.__SERVER__ = true;

// Configure JSX Harmony transform in order to be able
// require .js files with JSX
var jsExt = require.extensions['.js'];
var ignoreExt = function(module, file) { module._compile('', file); };
require.extensions['.less'] = ignoreExt;
require.extensions['.svg'] = ignoreExt;
require.extensions['.js'] = function(module, file) {
  if (file.indexOf('node_modules') === -1) {
    var src = fs.readFileSync(file, 'utf8');
    try {
      src = ReactTools.transform(src, {harmony: true, stripTypes: true});
    } catch (e) {
      throw new Error('Error transforming ' + file + '. ' + e.toString());
    }
    module._compile(src, file);
  } else {
    jsExt(module, file);
  }
};

// The top-level React component + HTML template for it
var App = React.createFactory(require('./components/App'));
var template = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
var Dispatcher = require('./core/Dispatcher');
var ActionTypes = require('./constants/ActionTypes');
var AppStore = require('./stores/AppStore');

var server = express();

server.set('port', (process.env.PORT || 5000));
server.use(express.static(path.join(__dirname, '../build')));

// Page API
server.get('/api/page/*', function(req, res) {
  var path = req.path.substr(9);
  var page = AppStore.getPage(path);
  res.send(page);
});

// Server-side rendering
server.get('*', function(req, res) {
  var data = {description: ''};
  var app = new App({
    path: req.path,
    onSetTitle: function(title) { data.title = title; },
    onSetMeta: function(name, content) { data[name] = content; },
    onPageNotFound: function() { res.status(404); }
  });
  data.body = React.renderToString(app);
  var html = _.template(template, data);
  res.send(html);
});

// Load pages from the `/src/pages/` folder into the AppStore
(function() {
  var assign = require('react/lib/Object.assign');
  var fm = require('front-matter');
  var jade = require('jade');
  var sourceDir = path.join(__dirname, './pages');
  var getFiles = function(dir) {
    var pages = [];
    fs.readdirSync(dir).forEach(function(file) {
      var stat = fs.statSync(path.join(dir, file));
      if (stat && stat.isDirectory()) {
        pages = pages.concat(getFiles(file));
      } else {
        // Convert the file to a Page object
        var filename = path.join(dir, file);
        var url = filename.
          substr(sourceDir.length, filename.length - sourceDir.length - 5)
          .replace('\\', '/');
        if (url.indexOf('/index', url.length - 6) !== -1) {
          url = url.substr(0, url.length - (url.length > 6 ? 6 : 5));
        }
        var source = fs.readFileSync(filename, 'utf8');
        var content = fm(source);
        var html = jade.render(content.body, null, '  ');
        var page = assign({}, {path: url, body: html}, content.attributes);
        Dispatcher.handleServerAction({
          actionType: ActionTypes.LOAD_PAGE,
          path: url,
          page: page
        });
      }
    });
    return pages;
  };
  return getFiles(sourceDir);
})();

server.listen(server.get('port'), function() {
  console.log('The server is running at http://localhost:' + server.get('port'));
});

module.exports.server = server;
