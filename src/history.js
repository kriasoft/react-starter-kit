import createBrowserHistory from 'history/createBrowserHistory';

// Navigation manager, e.g. history.push('/home')
// https://github.com/mjackson/history
export default process.env.BROWSER && createBrowserHistory();
