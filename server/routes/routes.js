import express from 'express';
import path from 'path';

import DB from './../core/Database';
import CONFIG from './../../config';
import periodToTime from './../shared/util/periodToTime';

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

router.get('/api/stocks', (req, res) => {
  const targetStocks = req.query.target;
  // Use '' to brace each stockName
  const stockStr = targetStocks ?
    targetStocks.split(',')
      .map(s => `'${s}'`)
      .join(',')
    : '';

  const period    = Number(req.query.period);
  const startTime = periodToTime(period) - 1;

  const stmt = `
    SELECT *
    FROM  dow30 t1
    WHERE Name IN (${stockStr})
    AND Date > ${startTime}
    ORDER BY Name ASC, Date DESC
  `;

  logger.trace('Query began', Date.now());

  DB.query(stmt)
  .then((result) => {
    logger.trace('Query ended', Date.now());
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


export default router;
