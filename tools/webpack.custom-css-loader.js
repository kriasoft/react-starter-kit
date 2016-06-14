/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import loaderUtils from 'loader-utils';
import processCss from 'css-loader/lib/processCss';
import getImportPrefix from 'css-loader/lib/getImportPrefix';
import camelCase from 'lodash.camelcase';

function dashesCamelCase(str) {
  return str.replace(/-(\w)/g, (match, firstLetter) => firstLetter.toUpperCase());
}

module.exports = function loader(content, sourceMap) {
  if (this.cacheable) {
    this.cacheable();
  }

  const callback = this.async();
  const query = loaderUtils.parseQuery(this.query);
  const moduleMode = query.modules || query.module;
  const camelCaseKeys = query.camelCase || query.camelcase;

  let map = sourceMap;
  if (map !== null && typeof map !== 'string') {
    map = JSON.stringify(map);
  }

  processCss(content, map, {
    mode: moduleMode ? 'local' : 'global',
    from: loaderUtils.getRemainingRequest(this),
    to: loaderUtils.getCurrentRequest(this),
    query,
    minimize: this.minimize,
    loaderContext: this,
  }, (err, result) => {
    if (err) {
      callback(err);
      return;
    }

    let cssAsString = JSON.stringify(result.source);

    // for importing CSS
    const importUrlPrefix = getImportPrefix(this, query);

    function importItemMatcher(item) {
      const match = result.importItemRegExp.exec(item);
      const idx = Number(match[1]);
      const importItem = result.importItems[idx];
      const importUrl = `${importUrlPrefix}${importItem.url}`;
      return `" + require(${loaderUtils.stringifyRequest(this, importUrl)})` +
        `[${JSON.stringify(importItem.export)}] + "`;
    }

    cssAsString = cssAsString.replace(result.importItemRegExpG, importItemMatcher.bind(this));
    if (query.url !== false) {
      cssAsString = cssAsString.replace(result.urlItemRegExpG, (item) => {
        const match = result.urlItemRegExp.exec(item);
        let idx = Number(match[1]);
        const urlItem = result.urlItems[idx];
        const url = urlItem.url;
        idx = url.indexOf('?#');
        if (idx < 0) {
          idx = url.indexOf('#');
        }
        let urlRequest;
        if (idx > 0) { // idx === 0 is catched by isUrlRequest
          // in cases like url('webfont.eot?#iefix')
          urlRequest = url.substr(0, idx);
          return `" + require(${loaderUtils.stringifyRequest(this, urlRequest)}) + "` +
            `${url.substr(idx)}`;
        }
        urlRequest = url;
        return `" + require(${loaderUtils.stringifyRequest(this, urlRequest)}) + "`;
      });
    }

    const sourceURL = path.relative(this.options.context, this.resourcePath);
    let moduleId = loaderUtils.getHashDigest(new Buffer(sourceURL), 'md5', 'base64', 5);

    if (query.sourceMap && result.map) {
      // add a SourceMap
      map = result.map;
      if (map.sources) {
        map.sources = map.sources.map((source) => {
          let p = path.relative(query.context || this.options.context, source.split('!').pop())
            .replace(/\\/g, '/');
          if (p.indexOf('../') !== 0) {
            p = `./${p}`;
          }
          return `/${p}`;
        }, this);
        map.sourceRoot = 'webpack://';
      }
      map.file = map.file.split('!').pop();
      cssAsString += ` + "\\n/*# sourceMappingURL=data:application/json;base64,${
        new Buffer(JSON.stringify(map)).toString('base64')}*/"`;
      cssAsString += ` + "\\n/*# sourceURL=${sourceURL}*/"`;
      moduleId = sourceURL;
    }

    const locals = Object.keys(result.exports).reduce((res, key) => {
      let valueAsString = JSON.stringify(result.exports[key]);
      valueAsString = valueAsString.replace(result.importItemRegExpG, importItemMatcher);

      if (camelCaseKeys === true) {
        res.push(`s.${camelCase(key)} = ${valueAsString};`);
      } else if (camelCaseKeys === 'dashes') {
        res.push(`s[${JSON.stringify(dashesCamelCase(key))}] = ${valueAsString};`);
      } else {
        res.push(`s[${JSON.stringify(key)}] = ${valueAsString};`);
      }

      return res;
    }, []).join('\n');

    // embed runtime
    callback(null, 'function s() {' +
      '\n  return {' +
      `\n    id: "${moduleId}",` +
      `\n    cssText: ${cssAsString}` +
      '\n  };' +
      '\n}' +
      `\n${locals}` +
      'module.exports = s;'
    );
  });
};
