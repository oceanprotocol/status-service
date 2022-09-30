import 'dotenv/config'
import sqlite3 from 'sqlite3'
import { Status, Network, dbRow } from '../@types/index'

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
          db.run(
            `CREATE TABLE IF NOT EXISTS statusHistory(
              network text,
              currentBlock integer,
              aquariusStatus text,
              aquariusResponse integer,
              aquariusChain number,
              aquariusVersion text,
              aquariusModuleVersion text,
              aquariusLatestRelease text,
              aquariusBlock integer,
              aquariusValidQuery number,
              providerStatus text, 
              providerResponse integer,
              providerVersion text,
              providerLatestRelease text,
              subgraphStatus text, 
              subgraphResponse integer,
              subgraphVersion text,
              subgraphLatestRelease text,
              subgraphBlock integer,
              operatorStatus text,
              operatorResponse integer,
              operatorVersion text,
              operatorLatestRelease text,
              operatorEnvironments integer,
              operatorLimitReached number,
              market text, 
              port text,
              faucetStatus text,
              faucetResponse integer,
              faucetEthBalance text,
              faucetEthBalanceSufficient text,
              faucetOceanBalance text,
              faucetOceanBalanceSufficient text,
              lastUpdatedOn integer
              )`
          ),
            console.log('Connected to database')
        }
      }
    )
  } catch (err) {
    console.error(err)
  }
}

function format(row: dbRow): Status {
  const response: Status = {
    network: row.network,
    lastUpdatedOn: row.lastUpdatedOn,
    currentBlock: row.currentBlock,
    market: row.market,
    port: row.port,
    dataFarming: row.dataFarming,
    daoGrants: row.daoGrants,
    aquarius: {
      status: row.aquariusStatus,
      response: row.aquariusResponse,
      version: row.aquariusVersion,
      moduleVersion: row.aquariusModuleVersion,
      latestRelease: row.aquariusLatestRelease,
      block: row.aquariusBlock,
      validQuery: Boolean(row.aquariusValidQuery),
      validChainList: Boolean(row.aquariusChain)
    },
    provider: {
      status: row.providerStatus,
      response: row.providerResponse,
      version: row.providerVersion,
      latestRelease: row.providerLatestRelease
    },
    subgraph: {
      status: row.subgraphStatus,
      response: row.subgraphResponse,
      version: row.subgraphVersion,
      latestRelease: row.subgraphLatestRelease,
      block: row.subgraphBlock
    },
    operator: {
      status: row.operatorStatus,
      response: row.operatorResponse,
      version: row.operatorVersion,
      latestRelease: row.operatorLatestRelease,
      environments: row.operatorEnvironments,
      limitReached: Boolean(row.operatorLimitReached)
    },
    faucet: row.faucetStatus
      ? {
          status: row.faucetStatus,
          response: row.faucetResponse,
          ethBalance: row.faucetEthBalance,
          ethBalanceSufficient: Boolean(row.faucetEthBalanceSufficient),
          oceanBalance: row.faucetOceanBalance,
          oceanBalanceSufficient: Boolean(row.faucetOceanBalanceSufficient)
        }
      : {}
  }
  return response
}

export async function networkStatus(
  network: string,
  callback: (data: Status) => void
) {
  try {
    db.all(
      `SELECT 
        network,
        currentBlock,
        aquariusStatus,
        aquariusResponse,
        aquariusChain,
        aquariusVersion,
        aquariusModuleVersion,
        aquariusLatestRelease,
        aquariusBlock,
        aquariusValidQuery,
        providerStatus, 
        providerResponse,
        providerVersion,
        providerLatestRelease,
        subgraphStatus, 
        subgraphResponse,
        subgraphVersion,
        subgraphLatestRelease,
        subgraphBlock,
        operatorStatus,
        operatorResponse,
        operatorVersion,
        operatorLatestRelease,
        operatorEnvironments,
        operatorLimitReached,
        market, 
        port,
        faucetStatus,
        faucetResponse,
        faucetEthBalance,
        faucetEthBalanceSufficient,
        faucetOceanBalance,
        faucetOceanBalanceSufficient,
        lastUpdatedOn FROM statusHistory WHERE network = "${network}" ORDER BY lastUpdatedOn DESC`,
      [],
      function (err, row: dbRow) {
        if (err) {
          return console.log(err.message)
        }
        const response = format(row[0])
        callback(response)
      }
    )
  } catch (err) {
    console.error(err)
  }
}

export async function getStatus(callback: (row: Status[]) => void) {
  const networks: Network[] = JSON.parse(process.env.NETWORKS)
  const status: Status[] = []
  for (let i = 0; i < networks.length; i++) {
    const network: string = networks[i].name
    await networkStatus(network, (data: Status) => {
      status.push(data)
      if (i === networks.length - 1) {
        callback(status)
      }
    })
  }
}

export function insert(status: Status) {
  try {
    db.run(
      `INSERT INTO statusHistory(
        network,
        currentBlock,
        aquariusStatus,
        aquariusResponse,
        aquariusChain,
        aquariusVersion,
        aquariusModuleVersion,
        aquariusLatestRelease,
        aquariusBlock,
        aquariusValidQuery,
        providerStatus, 
        providerResponse,
        providerVersion,
        providerLatestRelease,
        subgraphStatus, 
        subgraphResponse,
        subgraphVersion,
        subgraphLatestRelease,
        subgraphBlock,
        operatorStatus,
        operatorResponse,
        operatorVersion,
        operatorLatestRelease,
        operatorEnvironments,
        operatorLimitReached,
        market, 
        port,
        faucetStatus,
        faucetResponse,
        faucetEthBalance,
        faucetEthBalanceSufficient,
        faucetOceanBalance,
        faucetOceanBalanceSufficient,
        lastUpdatedOn
        ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        status.network,
        status.currentBlock,
        status.aquarius.status,
        status.aquarius.response,
        status.aquarius.validChainList,
        status.aquarius.version,
        status.aquarius.moduleVersion,
        status.aquarius.latestRelease,
        status.aquarius.block,
        status.aquarius.validQuery,
        status.provider.status,
        status.provider.response,
        status.provider.version,
        status.provider.latestRelease,
        status.subgraph.status,
        status.subgraph.response,
        status.subgraph.version,
        status.subgraph.latestRelease,
        status.subgraph.block,
        status.operator.status,
        status.operator.response,
        status.operator.version,
        status.operator.latestRelease,
        status.operator.environments,
        status.operator.limitReached,
        status.market,
        status.port,
        status.faucet.status,
        status.faucet.ethBalance,
        status.faucet.ethBalanceSufficient,
        status.faucet.oceanBalance,
        status.faucet.oceanBalanceSufficient,
        status.faucet.status,
        status.lastUpdatedOn
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
