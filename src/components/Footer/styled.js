import styled from 'styled-components';
import BasicLink from '../Link';

const commonTextStyle = `
  padding: 2px 5px;
  font-size: 1em;
`;

export const Root = styled.div`
  background: #333;
  color: #fff;
`;

export const Container = styled.div`
  margin: 0 auto;
  padding: 20px 15px;
  max-width: var(--max-content-width);
  text-align: center;
`;

export const Text = styled.span`
  ${commonTextStyle}
  color: rgba(255, 255, 255, 0.5);
`;

export const Spacer = styled.span.attrs({ children: '·' })`
  color: rgba(255, 255, 255, 0.3);
`;

export const Link = styled(BasicLink)`
  ${commonTextStyle}

  &,
  &:active,
  &:visited {
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
  }

  &:hover {
    color: rgba(255, 255, 255, 1);
  }
`;
