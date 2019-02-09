import React, { Component } from 'react';
import * as d3 from 'd3';
// eslint-disable-next-line
import * as d3Graphviz from 'd3-graphviz';
import PropTypes from 'prop-types';

class D3 extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
  };

  componentDidMount() {
    this.gv = d3.select(this.ref).graphviz();
    this.gv.renderDot(this.props.value);
  }

  componentDidUpdate() {
    this.gv.renderDot(this.props.value);
  }

  render() {
    return (
      <div className="App">
        <script
          src="https://unpkg.com/viz.js@1.8.0/viz.js"
          type="javascript/worker"
        />
        <div ref={ref => (this.ref = ref)} />
      </div>
    );
  }
}

export default D3;
