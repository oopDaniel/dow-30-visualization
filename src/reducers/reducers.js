import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import focus from './focus';


const rootReducer = combineReducers({
  focus,
  routing: routerReducer,
});

export default rootReducer;
