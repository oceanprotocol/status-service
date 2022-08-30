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
            'CREATE TABLE IF NOT EXISTS users(aquarius text, market text, port text, lastUpdatedOn integer)'
          )
        }
      }
    )
  } catch (err) {
    console.error(err)
  }
}

export async function find(network, callback) {
  try {
    db.all(
      `SELECT wallet, lastUpdatedOn FROM users WHERE network = "${network}" ORDER BY lastUpdatedOn DESC`,
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

export async function insert(status, callback) {
  // Insert some documents
  try {
    db.run(
      `INSERT INTO users(aquarius, market, port, lastUpdatedOn) VALUES(?, ?, ?, ?)`,
      [status.aquarius, status.market, status.port, Date.now()],
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
