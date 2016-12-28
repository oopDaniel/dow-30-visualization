
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
        data: {},
      };
      targetStock = result[stock.Name];
    }

    // Has no the record for this specific time, insert
    if (!targetStock.data[stock.Date]) {
      const min = targetStock.latest.reduce((a, b) => Math.min(a, b));

      // Only keep the latest timestamp in array
      if (min < stock.Date) {
        targetStock.latest = [
          ...targetStock.latest.slice(1),
          stock.Date,
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
