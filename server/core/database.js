import sqlite3 from 'sqlite3';
import CONFIG from './../../config';

const sqlite = sqlite3.verbose();
let logger = console;
if (CONFIG.log.useLogger) {
  logger = require('log4js').getLogger('cheese');
}


export default class Database {
  static db = new sqlite.Database(':memory:');
  static hasTableCreated = false;

  static createTable() {
    this.db.serialize( () => {
      const scheme = `(
        Name TEXT,
        Date INT,
        Open REAL,
        High REAL,
        Low REAL,
        Close REAL,
        Volume INT
      )`;
      this.db.run(`CREATE TABLE dow30 ${scheme}`);
    });
    this.hasTableCreated = true;
  }

  /**
   * Insert data into DB with its specific scheme
   * @param <string> name - Name of the stock
   * @param <dataset> dataset: { [date]: num, [open]: num, [close]: num,
   *                               [high]: num, [low]: num, [valumn]: num }
   */
  static insert(name, dataset) {
    if (!name || !dataset || 0 === Object.keys(dataset).length) return;

    if (!this.hasTableCreated) this.createTable();

    logger.trace('DB: inserting data...')
    this.db.serialize( () => {
      let stmt  = this.db.prepare('INSERT INTO dow30 (Name, Date, Open, Close, High, Low, Volume) VALUES (?, ?, ?, ?, ?, ?, ?)');
      const { date, open, close, high, low, volume } = dataset;
      stmt.run(name, date, open, close, high, low, volume);

      stmt.finalize();
    });
    logger.trace('DB: inserting data...done!');
  }


  /**
   * Query DB with any statement
   * @param <string> statement - the SQL statement to query
   * @return <Promise<any[]>> - the query result
   */
   static query(statement = 'SELECT rowid AS ids, * FROM dow30') {

    if (!this.hasTableCreated) this.createTable();

    //   this.db.serialize( () => {
    //   this.db.run('CREATE TABLE lorem (info TEXT)');

    //   let stmt = this.db.prepare('INSERT INTO lorem VALUES (?)');
    //   for (let i = 0; i < 10; i++) {
    //       stmt.run(`Ipsum ${i}`);
    //   }
    //   stmt.finalize();

    //   this.db.each('SELECT rowid AS id, info FROM lorem', (err, row) => {
    //       logger.info(`${row.id}: ${row.info}`);
    //   });
    // });

    return new Promise( (resolve, reject) => {
      this.db.serialize( () => {
        this.db.all(statement, (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      });
    });
  }

  static destroy() {
    this.db.close();
  }
}





// const initDB = () => {
//   const db = new sqlite3.Database(':memory:');
  // db.serialize( () => {
  //   db.run('CREATE TABLE lorem (info TEXT)');

  //   let stmt = db.prepare('INSERT INTO lorem VALUES (?)');
  //   for (let i = 0; i < 10; i++) {
  //       stmt.run(`Ipsum ${i}`);
  //   }
  //   stmt.finalize();

  //   db.each('SELECT rowid AS id, info FROM lorem', (err, row) => {
  //       console.log(`${row.id}: ${row.info}`);
  //   });
  // });

//   db.close();
// }
