import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import focus from './focus';
import stocks from './stocks';
import period from './period';
import isFetching from './isFetching';
import search from './search';


export default combineReducers({
  focus,
  stocks,
  period,
  isFetching,
  search,
  routing: routerReducer,
});

