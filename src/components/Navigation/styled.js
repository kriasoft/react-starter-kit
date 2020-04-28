import styled from 'styled-components';
import BasicLink from '../Link';

export const Root = styled.div`
  float: right;
  margin: 6px 0 0;
`;

export const Spacer = styled.span.attrs(({ children }) => ({
  children: children || ' | ',
}))`
  color: rgba(255, 255, 255, 0.3);
`;

export const Link = styled(BasicLink)`
  display: inline-block;
  padding: 3px 8px;
  text-decoration: none;
  font-size: 1.125em; /* ~18px */
  color: rgba(255, 255, 255, 0.6);

  &:active,
  &:visited {
    color: rgba(255, 255, 255, 0.6);
  }

  ${({ highlight }) =>
    highlight
      ? `
        margin-right: 8px;
        margin-left: 8px;
        border-radius: 3px;
        background: rgba(0, 0, 0, 0.15);
        color: #fff;

        &:hover {
          background: rgba(0, 0, 0, 0.3);
        }
      `
      : `
        &:hover {
          color: rgba(255, 255, 255, 1);
        }
      `}
`;
