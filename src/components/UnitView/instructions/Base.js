import _ from 'lodash';

export default class Base {
  constructor(root, tag, filterAttrs) {
    this.tag = tag || '';
    this.filterAttrs = filterAttrs || {};
    this.root = root;
  }

  static inputRenderAttrs(node, children, index) {
    const name = _.get(node, 'attribs.name');
    return {
      name,
      key: index,
      type: _.get(node, 'attribs.type'),
    };
  }

  shouldProcessNode(node) {
    if (node.name !== this.tag) return false;
    return Object.keys(this.filterAttrs).every(k => {
      const f = this.filterAttrs[k];
      const val = _.get(node, `attribs.${k}`);
      if (typeof f !== 'object') return val === f;
      else if (typeof f.$exists === 'boolean')
        return !((typeof val !== 'undefined') ^ f.$exists);
      return false;
    });
  }
}
