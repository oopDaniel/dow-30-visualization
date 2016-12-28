import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router, IndexRoute, Route } from 'react-router';

import App from './App/App';
import Dashboard from './Dashboard/Dashboard';
import Trend from './Trend/Trend';
import Detail from './Detail/Detail';
import './../styles/styles.css';

const propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object,
};

const Root = ({ store, history }) => (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Dashboard} />
        <Route path="/trend" component={Trend} />
      </Route>
      <Route path="/detail/:name" component={Detail} />
    </Router>
  </Provider>
);

Root.propTypes = propTypes;

export default Root;
