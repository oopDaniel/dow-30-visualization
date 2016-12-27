import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import focus from './focus';
import latest from './latest';
import period from './period';


const rootReducer = combineReducers({
  focus,
  latest,
  period,
  routing: routerReducer,
});

export default rootReducer;
