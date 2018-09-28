import _ from 'lodash';
import React from 'react';
import Base from './Base';

/**
 * hide or show a tag
 * JS_EXPR - usual logical expression in JS which can access variable
 * answers which refers to this.state.answers
 * @if-show="JS_EXPR"
 */
export default class ShowAttr extends Base {
  EXPR_CACHE = {};

  getCachedExpr(expr, template) {
    if (!this.EXPR_CACHE[expr])
      try {
        this.EXPR_CACHE[expr] = new Function('answers', template(expr)); // eslint-disable-line no-new-func
      } catch (e) {
        console.log(e); // eslint-disable-line no-console
        this.EXPR_CACHE[expr] = _.noop;
      }
    return this.EXPR_CACHE[expr];
  }

  /* eslint-disable class-methods-use-this */
  shouldProcessNode(node) {
    return _.get(node, ['attribs', 'show']);
  }

  processNode(node, children, index) {
    const fn = this.getCachedExpr(
      _.get(node, ['attribs', 'show']),
      expr => `return ${expr};`,
    );
    try {
      const show = fn(_.cloneDeep(this.root.state.answers));
      const CustomTag = node.name;
      return (
        <CustomTag
          style={show ? {} : { display: 'none' }}
          key={index}
          {...node.attribs}
        >
          {children}
        </CustomTag>
      );
    } catch (e) {
      console.log(e); // eslint-disable-line no-console
      return null;
    }
  }
}
