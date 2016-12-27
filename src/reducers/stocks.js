import {
  FETCH_LATEST_SUCCEEDED,
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


function stocks(state = {}, action) {
  switch (action.type) {
    case FETCH_LATEST_SUCCEEDED: {
      return {
        ...state,
        ...addStock(state, action.response),
      };
    }
    default: {
      return state;
    }
  }
}

export default stocks;
