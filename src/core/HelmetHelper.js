import Helmet from 'react-helmet';

export function getHeadString() {
  const helmet = Helmet.rewind();
  return Object.values(helmet).reduce((prev, next) => prev + next.toString(), '');
}
