import 'dotenv/config'
import sqlite3 from 'sqlite3'
import { Status } from '../@types/index'

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
            `CREATE TABLE IF NOT EXISTS statusHistory(
              aquarius text, 
              provider text, 
              subgraph text, 
              market text, 
              port text,
              faucet text,
              faucetResponse text,
              faucetEthBalance text,
              faucetEthBalanceSufficient text,
              faucetOceanBalance text,
              oceanBalanceSufficient text,
              lastUpdatedOn integer
              )`
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
      `SELECT wallet, lastUpdatedOn FROM statusHistory WHERE network = "${network}" ORDER BY lastUpdatedOn DESC`,
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

export async function insert(status: Status) {
  try {
    db.run(
      `INSERT INTO statusHistory(
        aquarius, 
        provider, 
        subgraph, 
        market, 
        port,
        faucet,
        faucetResponse,
        faucetEthBalance,
        faucetEthBalanceSufficient,
        faucetOceanBalance,
        oceanBalanceSufficient,
        lastUpdatedOn
        ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        status.aquarius,
        status.provider,
        status.subgraph,
        status.market,
        status.port,
        status.faucet.status,
        status.faucet.ethBalance,
        status.faucet.ethBalanceSufficient,
        status.faucet.oceanBalance,
        status.faucet.oceanBalanceSufficient,
        status.faucet.status,
        Date.now()
      ],
      function (err) {
        if (err) {
          return console.log(err.message)
        }
        // get the last insert id
      }
    )
  } catch (err) {
    console.error(err)
  }
}
