import 'babel-regenerator-runtime';
import path from 'path';
import fs from 'fs';
import express from 'express';
import helmet  from 'helmet';

// ==========================================

import log4js from 'log4js';
import { DataService } from './core';
import DB from './core/Database';
import router from './routes/routes';


const app = express();


// ============    log4js init   =============

const logPath = path.resolve(__dirname, 'logs');
if (!fs.existsSync(logPath)) {
  fs.mkdirSync(logPath);
}

log4js.loadAppender('file');
log4js.configure({
  appenders: [
    { type: 'console', category: 'normal' },
    {
      type: 'file',
      filename: path.resolve(logPath, 'cheese.log'),
      maxLogSize: 20480,
      backups: 10,
      category: 'cheese',
    },
  ],
});

const logger     = log4js.getLogger('normal');
const fileLogger = log4js.getLogger('cheese');

//   Record the accesses on console
app.use(log4js.connectLogger(logger, { level: log4js.levels.INFO }));

// ==========================================


DataService.init()
  .then(() => {
    const stmt = `
        SELECT *
        FROM  dow30
        WHERE IsLatest > 0
        AND Name = 'AA'
        ORDER BY Name ASC, Date DESC
      `;
    return DB.query(stmt);
  })
  .then(() => logger.info('Data is ready now'));


// ==========================================


if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack');
  const devConfig = require('../webpack.config.dev');
  const compiler = webpack(devConfig);
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo:     true,
    publicPath: devConfig.output.publicPath,
  }));
  app.use(require('webpack-hot-middleware')(compiler));
} else {
  // app.use(morgan('combined'));
  app.use(helmet());
  app.use('/static', express.static(path.join(__dirname, '..', 'dist')));
}


app.use('/', router);


const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, (err) => {
  if (err) {
    logger.error(err);
    fileLogger.error(err);
    return;
  }
  logger.info(`listening at ${host}:${port}`);
});
