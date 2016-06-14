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
import { makeDir, writeFile } from './lib/fs';

module.exports = async function loader(content) {
  if (this.cacheable) {
    this.cacheable();
  }

  const callback = this.async();
  const query = loaderUtils.parseQuery(this.query);
  if (query.outputPath) {
    const from = path.relative(this.options.context, this.resourcePath);
    const to = path.resolve(query.outputPath, from);
    await makeDir(path.dirname(to));
    await writeFile(to, content);
  }

  callback(null, content);
};

module.exports.raw = true;
