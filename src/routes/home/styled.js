import styled from 'styled-components';

export const NewsItem = styled.article`
  margin: 0 0 2rem;
`;

export const NewsTitle = styled.h1`
  font-size: 1.5rem;
`;

export const NewsDescription = styled.div`
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: 1.125rem;
  }

  pre {
    white-space: pre-wrap;
    font-size: 0.875rem;
  }

  img {
    max-width: 100%;
  }
`;
