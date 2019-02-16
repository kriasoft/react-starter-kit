import _ from 'lodash';
import React from 'react';
import Base from './Base';
import D3 from '../../Graphviz';

export default class ScriptGraphviz extends Base {
  constructor(root) {
    super(root, 'script', { type: 'text/vnd.graphviz' });
  }

  /* eslint-disable class-methods-use-this */
  processNode(node) {
    const value = _.get(node, 'children.0.data');
    return <D3 value={value} />;
  }
}
