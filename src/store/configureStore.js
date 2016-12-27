import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { routerReducer } from 'react-router-redux';
import createLogger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import * as reducers from './../reducers/reducers';
import rootSaga from './../sagas/sagas';


// Reducers
const reducer = combineReducers({
  ...reducers,
  routing: routerReducer,
});


const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares    = [sagaMiddleware];

  // Conditionally apply logging middlware when not in production
  if (process.env.NODE_ENV !== 'production') middlewares.push(createLogger());

  // Hot reload for devTool
  const enhancer = compose(
    applyMiddleware(...middlewares),
    window.devToolsExtension && window.devToolsExtension(),
  );

  // Create the store
  const store = createStore(reducer, enhancer);

  // init saga after the store created
  sagaMiddleware.run(rootSaga);


  return store;
};

export default configureStore;
