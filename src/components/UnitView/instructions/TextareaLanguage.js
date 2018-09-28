import _ from 'lodash';
import React from 'react';
import Base from './Base';
import TextEditor from '../../TextEditor';

/**
 * <input name="" type="text|color">
 */
export default class TextareaLanguage extends Base {
  constructor(root) {
    super(root, 'textarea', {
      name: { $exists: true },
      language: { $exists: true },
    });
  }

  processNode(node, children, index) {
    const name = _.get(node, 'attribs.name');
    const renderAttrs = {
      name,
      key: index,
      mode: _.get(node, 'attribs.language'),
    };
    const valueAttrs = {
      value:
        this.root.state.answers[name] || _.get(node, 'children[0].data', ''),
      onChange: this.root.updateAnswer.bind(this.root, name),
    };
    return <TextEditor {...renderAttrs} {...valueAttrs} />;
  }
}
