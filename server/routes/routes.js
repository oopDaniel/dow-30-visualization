import express from 'express'
import path from 'path';
import DB from './../core/Database';
import CONFIG from './../../config';


const router = express.Router();

let logger   = console;
if (CONFIG.log.useLogger) {
  logger     = require('log4js').getLogger('cheese');
}



router.get('/api/latest', (req, res) => {
  const stmt = `
    SELECT *
    FROM  dow30 t1
    INNER JOIN
    (
        SELECT Max(Date) Date, Name
        FROM   dow30
        GROUP BY name
    ) AS t2
        ON t1.Name = t2.Name
        AND t1.Date = t2.Date
    ORDER BY date DESC
  `;
    DB.query(stmt)
      .then( (result) => {
        res.setHeader('Content-Type', 'application-json; charset=utf-8');
        res.end(JSON.stringify(result));
      })
      .catch( (err) => {
        logger.log(err)
        const errMsg = { err };
        res.end(JSON.stringify(result));
      })
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
