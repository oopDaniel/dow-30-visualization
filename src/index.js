import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { Router, IndexRoute, Route, browserHistory } from 'react-router';

import configureStore from './store/configureStore';
import App from './components/App/App';
import Home from './components/Home/Home';
import './styles.css';


const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

// Required for replaying actions from devtools to work
// reduxRouterMiddleware.listenForReplays(store);
//
ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app'),
);
