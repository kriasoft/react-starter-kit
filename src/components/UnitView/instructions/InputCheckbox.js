import _ from 'lodash';
import React from 'react';
import Base from './Base';

/**
 * <input name="" type="checkbox">
 */
export default class InputCheckbox extends Base {
  constructor(root) {
    super(root, 'input', { name: { $exists: true }, type: 'checkbox' });
  }

  processNode(node, children, index) {
    const name = _.get(node, 'attribs.name');
    const renderAttrs = Base.inputRenderAttrs(node, children, index);
    const valueAttrs = {
      checked:
        this.root.state.answers[name] || _.get(node, 'attribs.value', ''),
      onChange: event => this.root.updateAnswer(name, event.target.checked),
    };
    return <input {...renderAttrs} {...valueAttrs} />;
  }
}
