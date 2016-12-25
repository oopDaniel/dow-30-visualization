const path    = require('path');
const express = require('express');
// const morgan  = require('morgan');
const helmet  = require('helmet');

const app     = express();



////////////////////////////////////


import CONFIG from './../config';
import Database from './core/Database';
import { DataService } from './core';
import log4js from 'log4js';
import router from './routes/routes';


// ============== log4js init ==============


log4js.loadAppender('file');
log4js.configure({
  appenders: [
    { type: 'console', category: 'normal' },
    {
      type: 'file',
      filename: 'logs/cheese.log',
      maxLogSize: 1024,
      backups: 3,
      category: 'cheese'
    }
  ]
});

const logger     = log4js.getLogger('normal');
const fileLogger = log4js.getLogger('cheese');

///   Record the accesses on console
app.use(log4js.connectLogger(logger, { level: log4js.levels.INFO }));


// ============== /log4js init ==============



DataService.init()
  .then( () => logger.info('Data is ready now'));

// let d = new Database();
// d.ins();
// setTimeout( () => Database.query().then(e => console.log('asd',e)), 3000);
// d.query();
////////////////////////////////////






// TODO - use passport.js
// TODO - use session store

// const session = require('express-session');
// const RedisStore = require('connect-redis')(session);

// const sessionOptions = {
//   host: process.env.REDIS_PORT_6379_TCP_ADDR || 'localhost',
//   port: process.env.REDIS_PORT_6379_TCP_PORT || 6379
// };

// app.use(session({
//   resave: false,
//   saveUninitialized: false,
//   store: new RedisStore(sessionOptions),
//   // you must replace this!
//   secret: 'c1c5089b5928b7acd4903ccf7171836a'
// }));

if (process.env.NODE_ENV !== 'production') {
  // app.use(morgan('dev'));
  const webpack = require('webpack');
  const devConfig = require('../webpack.config.dev');
  const compiler = webpack(devConfig);
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: devConfig.output.publicPath
  }));
  app.use(require('webpack-hot-middleware')(compiler));
} else {
  // app.use(morgan('combined'));
  app.use(helmet());
  app.use('/static', express.static(path.join(__dirname, '..', 'dist')));


}

// for api routes
// enable body parser
// const bodyParser = require('body-parser');
// app.use(bodyParser.json())


app.use('/', router);



const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, err => {
  if (err) {
    logger.error(err);
    fileLogger.error(err);
    return;
  }
  logger.info(`listening at ${host}:${port}`);
});
