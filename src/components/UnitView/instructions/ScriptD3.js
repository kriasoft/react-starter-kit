import _ from 'lodash';
import React from 'react';
import Base from './Base';
import D3 from '../../D3/D3';

export default class ScriptD3 extends Base {
  constructor(root) {
    super(root, 'script', { type: 'text/d3' });
  }

  /* eslint-disable class-methods-use-this */
  processNode(node) {
    const value = _.get(node, 'children.0.data');
    return <D3 value={value} />;
  }
}
