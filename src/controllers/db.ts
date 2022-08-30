import 'dotenv/config'
import sqlite3 from 'sqlite3'
let db

export async function connection() {
  try {
    db = new sqlite3.Database(
      process.env.DB_PATH,
      sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) {
          return console.log('Could not connect to database', err)
        } else {
          console.log('Connected to database')
          db.run(
            'CREATE TABLE IF NOT EXISTS users(market text, lastUpdatedOn integer)'
          )
        }
      }
    )
  } catch (err) {
    console.error(err)
  }
}

export async function find(address, callback) {
  try {
    db.all(
      `SELECT wallet, lastUpdatedOn FROM users WHERE wallet = "${address}" ORDER BY lastUpdatedOn DESC`,
      [],
      function (err, row) {
        if (err) {
          return console.log(err.message)
        }
        callback(row)
      }
    )
  } catch (err) {
    console.error(err)
  }
}

export async function insert(record, callback) {
  console.log('Inserting: ', record.market, record.lastUpdatedOn)
  // Insert some documents
  try {
    db.run(
      `INSERT INTO users(market, lastUpdatedOn) VALUES(?, ?)`,
      [record.market, record.lastUpdatedOn],
      function (err) {
        if (err) {
          return console.log(err.message)
        }
        // get the last insert id
      },

      callback()
    )
  } catch (err) {
    console.error(err)
  }
}
