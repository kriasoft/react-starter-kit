import React from 'react';

const ApplicationContext = React.createContext({
  fetch: () => {
    throw new Error('Fetch method not initialized.');
  },
});

export default ApplicationContext;
