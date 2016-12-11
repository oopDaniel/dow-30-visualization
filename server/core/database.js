const sqlite3 = require('sqlite3').verbose();


export default class Database {
    db;

    constructor() {
        this.db = new sqlite3.Database(':memory:');
    }

    /// -- TODO: implement this
    query() {
        return new Promose( (resolve, reject) => {

        })
    }
}

// const initDB = () => {
//   const db = new sqlite3.Database(':memory:');
//   db.serialize( () => {
//     db.run('CREATE TABLE lorem (info TEXT)');

//     let stmt = db.prepare('INSERT INTO lorem VALUES (?)');
//     for (let i = 0; i < 10; i++) {
//         stmt.run(`Ipsum ${i}`);
//     }
//     stmt.finalize();

//     db.each('SELECT rowid AS id, info FROM lorem', (err, row) => {
//         console.log(`${row.id}: ${row.info}`);
//     });
//   });

//   db.close();
// }