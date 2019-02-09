import _ from 'lodash';
import React from 'react';
import Base from './Base';

/**
 * <input type=file name=...>
 */
export default class InputFile extends Base {
  constructor(root, className) {
    super(root, 'input', { name: { $exists: true }, type: 'file' });
    this.className = className;
  }

  processNode(node, children, index) {
    const name = _.get(node, 'attribs.name');
    const renderAttrs = Base.inputRenderAttrs(node, children, index);
    const { id } = this.root.state.answers[name] || {};
    return (
      <div className={this.className}>
        <button onClick={() => this.ref.click()}>Upload File</button>
        {id && <a href={`/api/get_file/${id}`}>{id}</a>}
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
