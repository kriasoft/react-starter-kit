import _ from 'lodash';
import React from 'react';
import Base from './Base';

/**
 * gathering info about H1..6 tags
 */
export default class Headers extends Base {
  constructor(root, onHeadersChange) {
    super(root);
    this.onHeadersChange = onHeadersChange;
  }

  shouldProcessNode(node) {
    if (!this.onHeadersChange) return false;
    return /^[hH]([1-6])$/.exec(node.name);
  }

  processNode(node, children, index) {
    const level = +/^[hH]([1-6])$/.exec(node.name)[1];
    const id =
      _.get(node, 'attribs.id') ||
      _.get(node, 'attribs.name') ||
      `header-${index}`;
    this.root.headers.push({
      level,
      id,
      title: node.children
        .filter(c => c.type === 'text')
        .map(c => c.data)
        .join(' '),
    });
    const renderAttrs = { id, key: index };
    const CustomTag = node.name;
    return <CustomTag {...renderAttrs}>{children}</CustomTag>;
  }
}
