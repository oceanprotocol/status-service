import 'dotenv/config'
import aquariusStatus from './services/aquarius'
import marketStatus from './services/market'
import providerStatus from './services/provider'
import subgraphStatus from './services/subgraph'
import operatorStatus from './services/operator'
import faucetStatus from './services/faucet'
import dfStatus from './services/dataFarming'
import { IStatus, INetwork, ICurrentVersions, State } from '../@types/index'
import notification from './notification'
import { getBlock } from './utils/ethers'
import { insertMany } from '../db/mongodb'
import latestRelease from './utils/github'

async function getStatus(
  network: INetwork,
  currentVersions: ICurrentVersions,
  marketState: State,
  dfState: State
): Promise<IStatus> {
  console.log(`Starting checking componentes for ${network.name}`)
  console.time(`Finished checking componentes for ${network.name}`)
  const currentBlock = await getBlock(network)
  const provider = await providerStatus(
    network.name,
    currentVersions.providerLatestVersion
  )
  const subgraph = await subgraphStatus(
    network,
    currentBlock,
    currentVersions.subgraphLatestVersion
  )
  const aquarius = await aquariusStatus(
    network,
    currentBlock,
    currentVersions.aquariusLatestVersion
  )
  const operator = await operatorStatus(
    network.chainId,
    currentVersions.operatorLatestVersion
  )

  const status: IStatus = {
    network: network.name,

    currentBlock,
    components: {
      market: { status: marketState },
      dataFarming: { status: dfState },
      faucet: {},
      provider,
      subgraph,
      aquarius,
      operator
    },
    lastUpdatedOn: Date.now()
  }

  if (network.faucetWallet && network.rpcUrl)
    status.components.faucet = await faucetStatus(network)
  console.timeEnd(`Finished checking componentes for ${network.name}`)
  return status
}

export default async function monitor(): Promise<string> {
  if (!process.env.NETWORKS) {
    return 'No network data provided'
  }
  console.log(`Started checking the components`)
  console.time(`Updated status for all networks`)
  const networks: INetwork[] = JSON.parse(process.env.NETWORKS)
  const market = await marketStatus()
  const dataFarming = await dfStatus()

  const currentVersions: ICurrentVersions = {
    providerLatestVersion: await latestRelease('provider'),
    aquariusLatestVersion: await latestRelease('aquarius'),
    subgraphLatestVersion: await latestRelease('ocean-subgraph'),
    operatorLatestVersion: await latestRelease('operator-service')
  }

  try {
    const promise: Promise<IStatus>[] = []
    for (let i = 0; i < networks.length; i++) {
      const network: INetwork = networks[i]

      promise.push(getStatus(network, currentVersions, market, dataFarming))
    }

    const results = await Promise.all(promise)

    // send notification email
    notification(results)
    // Update DB

    console.timeEnd(`Updated status for all networks`)
    const dbResponse = await insertMany(results)
    return dbResponse
  } catch (error) {
    const response = String(error)
    console.log('# error: ', response)
    return `ERROR: ${response}`
  }
}
