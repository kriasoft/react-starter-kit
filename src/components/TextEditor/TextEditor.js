import React from 'react';
import PropTypes from 'prop-types';

let brace; // eslint-disable-line no-unused-vars
let AceEditor;

if (navigator.platform) {
  /* eslint-disable global-require */
  brace = require('brace');
  AceEditor = require('react-ace').default;
  require('brace/mode/html');
  require('brace/mode/json');
  require('brace/theme/chrome');
}

class TextEditor extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onLoad: PropTypes.func.isRequired,
    mode: PropTypes.string,
  };

  static defaultProps = {
    mode: 'html',
    value: '',
  };

  constructor() {
    super();
    this.onLoad = this.onLoad.bind(this);
  }

  onLoad(editor) {
    this.editor = editor;
    editor.focus();
    editor.getSession().setUseWrapMode(true);
    if (this.props.onLoad) this.props.onLoad(editor);
  }

  render() {
    if (!AceEditor) return null;
    return (
      <AceEditor
        mode={this.props.mode}
        theme="chrome"
        tabSize={2}
        name="code"
        width="100%"
        maxLines={50}
        ref={ace => {
          this.ace = ace;
        }}
        value={this.props.value}
        editorProps={{ $blockScrolling: Infinity }}
        onLoad={this.onLoad}
        onChange={this.props.onChange}
      />
    );
  }
}

export default TextEditor;
