/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import webpack from 'webpack';
import path from "path";
import fm from "front-matter";
import MarkdownIt from "markdown-it";

module.exports = function markdownLoader(this: webpack.loader.LoaderContext, source: string) {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
  });

  const frontmatter = fm<{key: string, html: string}>(source);
  frontmatter.attributes.key = path.basename(this.resourcePath, '.md');
  frontmatter.attributes.html = md.render(frontmatter.body);

  return `module.exports = ${JSON.stringify(frontmatter.attributes)};`;
};
