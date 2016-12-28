import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { Router, IndexRoute, Route, browserHistory } from 'react-router';

import configureStore from './store/configureStore';
import App from './components/App/App';
import Dashboard from './components/Dashboard/Dashboard';
import Trend from './components/Trend/Trend';
import Detail from './components/Detail/Detail';
import './styles.css';


const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

// Required for replaying actions from devtools to work
// reduxRouterMiddleware.listenForReplays(store);


ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Dashboard} />
        <Route path="/trend" component={Trend} />
      </Route>
      <Route path="/detail" component={Detail} />
    </Router>
  </Provider>,
  document.getElementById('app'),
);
