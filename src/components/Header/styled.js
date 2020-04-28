import styled from 'styled-components';
import BasicLink from '../Link';
import logoUrl from './logo-small.png';
import logoUrl2x from './logo-small@2x.png';

export const Root = styled.div`
  background: #373277;
  color: #fff;
`;

export const Container = styled.div`
  margin: 0 auto;
  padding: 20px 0;
  max-width: var(--max-content-width);
`;

export const BrandText = styled.span`
  margin-left: 10px;
`;

export const BrandLink = styled(BasicLink)`
  color: rgb(146, 229, 252);
  text-decoration: none;
  font-size: 1.75em; /* ~28px */
`;

export const Logo = styled.img.attrs({
  src: logoUrl,
  srcSet: `${logoUrl2x} 2x`,
  alt: 'React',
})`
  width: 38px;
  height: 38px;
`;

export const Banner = styled.div`
  text-align: center;
`;

export const BannerTitle = styled.h1`
  margin: 0;
  padding: 10px;
  font-weight: normal;
  font-size: 4em;
  line-height: 1em;
`;

export const BannerDescription = styled.p`
  padding: 0;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.25em;
  margin: 0;
`;
