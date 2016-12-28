import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import focus from './focus';
import stocks from './stocks';
import period from './period';
import isFetching from './isFetching';


export default combineReducers({
  focus,
  stocks,
  period,
  isFetching,
  routing: routerReducer,
});

