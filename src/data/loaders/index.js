import personLoader from './personLoader';

// All your dataloaders
const allLoaders = {
  ...personLoader,
};

export default function loaders() {
  return allLoaders;
}
