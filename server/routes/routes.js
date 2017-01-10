import express from 'express';
import path from 'path';
import DB from './../core/Database';
import CONFIG from './../../config';


const router = express.Router();

let logger = console;
if (CONFIG.log.useLogger) {
  logger = require('log4js').getLogger('cheese');
}


router.get('/api/latest', (req, res) => {
  const targetStocks = req.query.target;
  // Use '' to brace each stockName
  const stockStr = targetStocks ?
    targetStocks.split(',')
      .map(s => `'${s}'`)
      .join(',')
    : '';

  // const stmt = `
  //   SELECT *
  //   FROM  dow30 t1
  //   INNER JOIN
  //   (
  //       SELECT Max(Date) Date, Name
  //       FROM   dow30
  //       WHERE Name IN (${stockStr})
  //       GROUP BY name, Date
  //   ) AS t2
  //       ON t1.Name = t2.Name
  //       AND t1.Date = t2.Date
  //   ORDER BY date DESC
  // `;

  const stmt = `
    SELECT *
    FROM  dow30 t1
    WHERE IsLatest > 0
    AND Name IN (${stockStr})
    ORDER BY Name ASC, Date DESC
  `;

  logger.trace('Query began', Date.now());

  DB.query(stmt)
  .then((result) => {
    logger.trace('Query ended', Date.now());
    console.log(result);
    res.setHeader('Content-Type', 'application-json; charset=utf-8');
    res.end(JSON.stringify(result));
  })
  .catch((err) => {
    logger.trace('Query ended', Date.now());
    logger.error(err);
    const errMsg = { err };
    res.end(JSON.stringify(errMsg));
  });
});

router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../..', 'index.html'));
});

// router.get(/^\/((?!api).*)$/, (req, res) => {
//   console.log('get all')
//   res.sendFile(path.join(__dirname, '..', 'index.html'));
// });
//
export default router;
