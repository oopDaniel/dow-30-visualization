
/**
 * TODO: Add normalized period for each stock
 */

const addStock = (state, res) => {
  const result = { ...state };
  res.forEach((stock) => {
    let targetStock = result[stock.Name];

    // Has no target stock array previously, create one
    if (!targetStock) {
      result[stock.Name] = {
        latest: [stock.Date, stock.Date],
        period: [],
        data: {},
      };
      targetStock = result[stock.Name];
    }

    targetStock.period.push(stock.Date);

    // Has no the record for this specific time, insert
    if (!targetStock.data[stock.Date]) {
      const latests      = targetStock.latest;
      const hasSameStock = latests[0] === latests[1];
      const minLatest    = latests.reduce((a, b) => Math.min(a, b));

      // Only keep the latest timestamp in array
      if (minLatest < stock.Date) {
        targetStock.latest = [
          ...targetStock.latest.slice(1),
          stock.Date,
        ];
      } else if (hasSameStock && minLatest > stock.Date) {
        targetStock.latest = [
          stock.Date,
          ...targetStock.latest.slice(1),
        ];
      }

      const prepare = { ...stock };
      delete prepare.Name;
      delete prepare.Date;
      targetStock.data[stock.Date] = prepare;
    }
  });
  return result;
};

export default addStock;
