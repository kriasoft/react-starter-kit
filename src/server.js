/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

require('source-map-support').install();

import 'babel/polyfill';
import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import express from 'express';
import React from 'react';
import './core/Dispatcher';
import './stores/AppStore';
import db from './core/Database';
import App from './components/App';

const server = express();

server.set('port', (process.env.PORT || 5000));
server.use(express.static(path.join(__dirname)));

//
// Register API middleware
// -----------------------------------------------------------------------------
require('./api/query')(server);

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------

// The top-level React component + HTML template for it
const templateFile = path.join(__dirname, 'templates/index.html');
const template = _.template(fs.readFileSync(templateFile, 'utf8'));

server.get('*', async (req, res, next) => {
  try {
    let uri = req.path;
    let notFound = false;
    let data = {description: ''};
    let app = <App
      path={req.path}
      onSetTitle={(title) => { data.title = title; }}
      onSetMeta={(name, content) => { data[name] = content; }}
      onPageNotFound={() => { notFound = true; }} />;

    await db.getPage(uri);
    data.body = React.renderToString(app);

    if (notFound) {
      res.status(404).send();
    } else {
      let html = template(data);
      res.send(html);
    }
  } catch (err) {
    next(err);
  }
});

//
// Launch the server
// -----------------------------------------------------------------------------

server.listen(server.get('port'), () => {
  if (process.send) {
    process.send('online');
  } else {
    console.log('The server is running at http://localhost:' + server.get('port'));
  }
});
