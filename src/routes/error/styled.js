import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  html {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 2rem;
    height: 100%;
    font-family: sans-serif;
    text-align: center;
    color: #888;
  }

  body {
    margin: 0;
  }

  h1 {
    font-weight: 400;
    color: #555;
  }

  pre {
    white-space: pre-wrap;
    text-align: left;
  }
`;
