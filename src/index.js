import React from 'react';
import ReactDOM from 'react-dom';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';

import configureStore from './store/configureStore';
import Root from './components/Root';


const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

// Required for replaying actions from devtools to work
// reduxRouterMiddleware.listenForReplays(store);

ReactDOM.render(
  <Root
    store={store}
    history={history}
  />,
  document.getElementById('app'),
);
