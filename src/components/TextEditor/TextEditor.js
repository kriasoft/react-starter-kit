import React from 'react';
import brace from 'brace'; // eslint-disable-line no-unused-vars
import AceEditor from 'react-ace';
import 'brace/mode/html';
import 'brace/theme/chrome';

class Footer extends React.Component {
  constructor() {
    super();
    this.onLoad = this.onLoad.bind(this);
    this.brace = brace;
  }

  onLoad(editor) {
    this.editor = editor;
    editor.focus();
    editor.getSession().setUseWrapMode(true);
  }

  render() {
    return (
      <AceEditor
        mode="html"
        theme="chrome"
        name="code"
        width="100%"
        maxLines={50}
        ref={ace => {
          this.ace = ace;
        }}
        fontSize={18}
        value="#type your code here"
        editorProps={{ $blockScrolling: Infinity }}
        onLoad={this.onLoad}
      />
    );
  }
}

export default Footer;
