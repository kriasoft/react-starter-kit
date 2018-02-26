const path = require('path');
const fm = require('front-matter');
const MarkdownIt = require('markdown-it');

module.exports = function markdownLoader(source) {
  const md = new MarkdownIt('commonmark');

  const frontmatter = fm(source);
  frontmatter.attributes.key = path.basename(this.resourcePath, '.md');
  frontmatter.attributes.html = md.render(frontmatter.body);

  return `module.exports = ${JSON.stringify(frontmatter.attributes)};`;
};
