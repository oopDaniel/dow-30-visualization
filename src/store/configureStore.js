import { createStore, compose, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './../reducers/reducers';
import rootSaga from './../sagas/sagas';


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
  const store = createStore(rootReducer, enhancer);


// // Enable Webpack hot module replacement for reducers
//   if (module.hot) {
//     module.hot.accept('./../reducers/reducers', () => {
//       const nextRootReducer = require('./../reducers/reducers').default;
//       store.replaceReducer(nextRootReducer);
//     });
//   }


  // init saga after the store created
  sagaMiddleware.run(rootSaga);


  return store;
};

export default configureStore;
