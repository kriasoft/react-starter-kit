import _ from 'lodash';
import React from 'react';
import Base from './Base';

/**
 * <input name="" type="text|color">
 */
export default class InputText extends Base {
  constructor(root) {
    super(root, 'input', { name: { $exists: true }, type: 'text' });
  }

  processNode(node, children, index) {
    const name = _.get(node, 'attribs.name');
    const renderAttrs = Base.inputRenderAttrs(node, children, index);
    const valueAttrs = {
      value: this.root.state.answers[name] || _.get(node, 'attribs.value', ''),
      onChange: event => this.root.updateAnswer(name, event.target.value),
    };
    return <input {...renderAttrs} {...valueAttrs} />;
  }
}
