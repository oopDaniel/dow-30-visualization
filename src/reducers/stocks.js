import { combineReducers } from 'redux';
import {
  FETCH_LATEST_SUCCEEDED,
} from './../consts/actionTypes';


function addStock(state, res) {
  const result = { ...state };
  res.forEach((stock) => {
    let targetArr = result[stock.Name];

    // Has no target stock array previously, create one
    if (!targetArr) {
      result[stock.Name] = [];
      targetArr = result[stock.Name];
    }

    // Has no the record for this specific time, insert
    if (targetArr.indexOf(stock.Date) === -1) {
      const prepare = { ...stock };
      delete prepare.Name;
      targetArr.push(prepare);
    }
  });
  return result;
}


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
      const names = [
        ...state,
        ...action.response.map(s => s.Name),
      ];
      return Array.from(new Set(names));
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
