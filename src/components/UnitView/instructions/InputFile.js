import _ from 'lodash';
import React from 'react';
import Base from './Base';
import s from './InputFile.css';

/**
 * <input type=file name=...>
 */
export default class InputFile extends Base {
  constructor(root) {
    super(root, 'input', { type: 'file' });
  }

  processNode(node, children, index) {
    const name = _.get(node, 'attribs.name');
    const renderAttrs = Base.inputRenderAttrs(node, children, index);
    return (
      <div className={s.inputFile}>
        {_.get(this.root.state.answers[name], 'id')}
        <button onClick={() => this.ref.click()}>upload new file</button>
        <input
          ref={ref => (this.ref = ref)}
          {...renderAttrs}
          onChange={event =>
            this.root.updateAnswer(name, event.target.files[0])
          }
        />
      </div>
    );
  }
}
