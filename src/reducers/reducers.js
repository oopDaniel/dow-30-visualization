import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import focus from './focus';
import latest from './latest';


const rootReducer = combineReducers({
  focus,
  latest,
  routing: routerReducer,
});

export default rootReducer;
