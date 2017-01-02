
export const getFocused = state => state.focus;
export const getStocks = state => state.stocks;
export const getSearch = state => state.search;
export const getStockNames = state => getStocks(state).allNames;

export const getLatestStocks = stock => stock.latest.map(date =>
  ({
    ...stock.data[date],
    Date: date,
  }));


/* eslint-disable no-param-reassign */
function filterObjByKeys(rawStockMap, keys) {
  return Object.keys(rawStockMap)
    .filter(key => keys.indexOf(key) > -1)
    .reduce((obj, stockName) => {
      obj[stockName] = rawStockMap[stockName];
      return obj;
    }, {});
}
/* eslint-enable */


export const getStocksByFocus = (state) => {
  const { focus, stocks } = state;
  return {
    allNames: stocks.allNames.filter(s => focus.indexOf(s) > -1),
    byName: filterObjByKeys(stocks.byName, focus),
  };
};

