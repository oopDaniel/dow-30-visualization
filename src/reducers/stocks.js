import { combineReducers } from 'redux';
import {
  FETCH_LATEST_SUCCEEDED,
} from './../consts/actionTypes';
import addStock from './addStock';


const byName = (state = {}, action) => {
  switch (action.type) {
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
