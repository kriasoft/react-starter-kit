import React from 'react';
import github from 'react-syntax-highlighter/dist/styles/hljs/github';
import SyntaxHighlighter from 'react-syntax-highlighter';

export default ({ children, props }) => (
  <SyntaxHighlighter {...props} style={github}>
    {children}
  </SyntaxHighlighter>
);
