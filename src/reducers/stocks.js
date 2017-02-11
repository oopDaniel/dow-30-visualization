/* eslint-disable no-return-assign */
import { combineReducers } from 'redux';
import {
  FETCH_LATEST_SUCCEEDED,
  FETCH_TREND_SUCCEEDED,
  SWITCH_PERIOD,
} from './../consts/actionTypes';
import addStock from './addStock';


const byName = (state = {}, action) => {
  switch (action.type) {
    case SWITCH_PERIOD: {
      const newState = { ...state };
      Object.keys(state)
        .forEach(name => newState[name].period = []);
      return newState;
    }
    case FETCH_TREND_SUCCEEDED:
    case FETCH_LATEST_SUCCEEDED: {
      return addStock(state, action.response);
    }
    default: {
      return state;
    }
  }
};

const allNames = (state = [], action) => {
  switch (action.type) {
    case FETCH_TREND_SUCCEEDED:
    case FETCH_LATEST_SUCCEEDED: {
      const stockNames = [
        ...state,
        ...action.response.map(s => s.Name),
      ];
      return Array.from(new Set(stockNames));
    }
    default: {
      return state;
    }
  }
};


const stocks = combineReducers({
  byName,
  allNames,
});

export default stocks;
