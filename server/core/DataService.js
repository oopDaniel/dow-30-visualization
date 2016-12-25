/**
 * DataService: Make sure data is accessible
 *
 *  'init()' before making any DB query
 */

import {
  DOW30,
  END_POINT,
  API_URL,
  API_POSTFIX,
} from './../const';
import Request  from './request';
import DB       from './Database';
import fs       from 'fs';
import path     from 'path';
import CONFIG from './../../config';
import toTimestamp from './../shared/util/TimeFormatter';

let logger = console;
if (CONFIG.log.useLogger) {
  logger = require('log4js').getLogger('cheese');
}


export class DataService {

  static init() {
    // DOW30.forEach( companyID => this.initData(companyID) );
    return this.readBackupFiles()
      .then( this.storeToDB, this.log );
  }

  static readBackupFiles() {
    const fileDir =  path.join(__dirname, '..', 'backup');

    return new Promise( (resolve, reject) => {
      fs.readdir(fileDir, (err, files) => {
        if (err) {
          logger.error(err);
          reject(err);
        }

        var count = files.length;
        var results = {};
        files.forEach( (fileName) => {
          fs.readFile(path.join(fileDir, fileName), 'utf8', (err, data) => {
            if (err) {
              logger.error(err);
              reject(err);
            }

            const baseName = path.basename(fileName, '.json')
            results[baseName] = this.safeParse(data);
            count--;

            if (count <= 0) {
              resolve(results);
            }
          });
        });
      });
    });

  }

  static safeParse(json) {
    try {
      return JSON.parse(json);
    } catch (e){
      logger.error('Error parsing json:', e);
      return undefined;
    }
  }

  //////// API as data source //////
  // static initData(id) {
  //   console.log(`processing ${id}`)
  //   const options = this.getRequestOptions(id);
  //   return Request(options, id)
  //   .then(
  //     this.makeBackup,
  //     this.useBackup,
  //     )
  //   .then(this.toDB);
  // }


  static getRequestOptions(id) {
    return {
      host: END_POINT,
      port: 443,
      path: `${API_URL}${id}${API_POSTFIX}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }

  /// --  TODO: implement functions below

  /// In lest API was inaccessible
  static makeBackup(d) {
    console.log('Make backup!');
    return d;
  }

  static useBackup(d) {
    console.log('Use backup!');
    return d;
  }

  static storeToDB(data) {
    const keys = Object.keys(data);
    keys.forEach( (name) => {
      const rows = data[name].dataset_data.data;
      const len  = rows.length;

      // for (let i = 0; i < len; ++i) {
      //   DB.insert(name, {
      //     Date:   toTimestamp(rows[i][0]),
      //     Open:   rows[i][1],
      //     High:   rows[i][2],
      //     Low:    rows[i][3],
      //     Close:  rows[i][4],
      //     Volume: rows[i][5],
      //   });
      // }
      //
      DB.insert(name, {
          date:   toTimestamp(rows[0][0]),
          open:   rows[0][1],
          high:   rows[0][2],
          low:    rows[0][3],
          close:  rows[0][4],
          volume: rows[0][5],
        });
    });

  }


  log(err) {
    logger.error (err || 'Something went wrong..');
  }


}
