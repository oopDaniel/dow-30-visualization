
export const getFocused = state => state.focus;
export const getStocks = state => state.stocks;

export const getLatestStocks = stock => stock.latest.map(date =>
  ({
    ...stock.data[date],
    Date: date,
  }));


/* eslint-disable no-param-reassign */
function filterObjByKeys(raw, keys) {
  return Object.keys(raw)
    .filter(key => keys.includes(key))
    .reduce((obj, key) => {
      obj[key] = raw[key];
      return obj;
    }, {});
}
/* eslint-enable */


export const getStocksByFocused = (state) => {
  console.error(state);
  const { focused, stocks } = state;
  return {
    ...state,
    stocks: {
      allNames: stocks.allNames.filter(s => focused.includes(s)),
      byName: filterObjByKeys(stocks.byName, focused),
    },
  };
};

