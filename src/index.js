import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import { Router, IndexRoute, Route, browserHistory } from 'react-router';
import createLogger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import rootSaga from './sagas/sagas';
import * as reducers from './reducers/reducers';
import App from './views/App/App';
import Home from './views/Home/Home';
import './styles.css';

const reducer = combineReducers({
  ...reducers,
  routing: routerReducer,
});
const logger = createLogger();
const sagaMiddleware = createSagaMiddleware();
const createStoreWithMiddleware = applyMiddleware(sagaMiddleware, logger)(createStore);
const store = createStoreWithMiddleware(reducer);
const history = syncHistoryWithStore(browserHistory, store);

sagaMiddleware.run(rootSaga);
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
