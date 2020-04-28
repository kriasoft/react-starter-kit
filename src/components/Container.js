import styled from 'styled-components';

export default styled.div`
  margin: 0 auto;
  padding: 0 0 40px;
  max-width: ${({ maxWidth }) => maxWidth || 'var(--max-content-width)'};
`;
