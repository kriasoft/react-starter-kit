import styled from 'styled-components';

export const Root = styled.div`
  background: #f5f5f5;
  color: #333;
`;

export const Container = styled.div`
  margin: 0 auto;
  padding: 20px 8px;
  max-width: var(--max-content-width);
  text-align: center;
  font-size: 1.5em; /* ~24px */
`;

export const Spacer = styled.span.attrs({ children: '|' })`
  padding-right: 15px;
  padding-left: 15px;
`;

export const A = styled.a`
  &,
  &:active,
  &:hover,
  &:visited {
    color: #333;
    text-decoration: none;
  }

  &:hover {
    text-decoration: underline;
  }
`;
