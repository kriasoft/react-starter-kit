/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import request from 'superagent';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';

const getBaseUrl = (() => {
  let baseUrl;
  return () => baseUrl || (baseUrl = ExecutionEnvironment.canUseDOM ? '' :
    process.env.WEBSITE_HOSTNAME ?
      `http://${process.env.WEBSITE_HOSTNAME}` :
      `http://127.0.0.1:${global.server.get('port')}`);
})();

const http = {

  get: path => new Promise((resolve, reject) => {
    request
      .get(getBaseUrl() + path)
      .accept('application/json')
      .end((err, res) => {
        if (err) {
          if (err.status === 404) {
            resolve(null);
          } else {
            reject(err);
          }
        } else {
          resolve(res.body);
        }
      });
  })

};

export default http;
