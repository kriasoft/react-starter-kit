import _ from 'lodash';
import React from 'react';
import Base from './Base';
import SyntaxHighlighter from '../../SyntaxHighlighter';

/**
 * <pre><code class="javascript">
 * ...
 * </code></pre>
 */
export default class PreCode extends Base {
  constructor(root) {
    super(root, 'pre');
  }

  shouldProcessNode(node) {
    if (!super.shouldProcessNode(node)) return false;
    return _.get(node, 'children[0].name') === 'code';
  }

  /* eslint-disable class-methods-use-this */
  processNode(node, children, index) {
    const value = _.get(node, 'children[0].children[0].data', '').trim();
    const lang = _.get(node, 'children[0].attribs.class');
    return (
      <SyntaxHighlighter key={index} language={lang}>
        {value}
      </SyntaxHighlighter>
    );
  }
}
