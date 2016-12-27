import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import focus from './focus';
import stocks from './stocks';
import period from './period';
import isFetching from './isFetching';


const rootReducer = combineReducers({
  focus,
  stocks,
  period,
  isFetching,
  routing: routerReducer,
});

export default rootReducer;
