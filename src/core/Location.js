/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import createHistory from 'history/lib/createBrowserHistory';
import createMemoryHistory from 'history/lib/createMemoryHistory';
import useQueries from 'history/lib/useQueries';

const location = useQueries(canUseDOM ? createHistory : createMemoryHistory)();

export default location;
