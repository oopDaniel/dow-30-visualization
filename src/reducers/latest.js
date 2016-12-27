import {
  FETCH_LATEST_REQUEST,
  FETCH_LATEST_SUCCEEDED,
  FETCH_LATEST_FAILED,
} from './../consts/actionTypes';


function addStock(prev, res) {
  const result = { ...prev };
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


function latest(state = {
  isFetching: false,
  stocks: {},
}, action) {
  switch (action.type) {
    case FETCH_LATEST_REQUEST: {
      return {
        ...state,
        isFetching: true,
      };
    }
    case FETCH_LATEST_SUCCEEDED: {
      return {
        ...state,
        isFetching: false,
        stocks: addStock(state.stocks, action.response),
      };
    }
    case FETCH_LATEST_FAILED: {
      return {
        ...state,
        isFetching: false,
      };
    }
    default: {
      return state;
    }
  }
}

export default latest;
