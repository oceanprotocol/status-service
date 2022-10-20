import 'dotenv/config'
import aquariusStatus from './services/aquarius'
import marketStatus from './services/market'
import providerStatus from './services/provider'
import subgraphStatus from './services/subgraph'
import operatorStatus from './services/operator'
import faucetStatus from './services/faucet'
import dfStatus from './services/dataFarming'
import { IStatus, INetwork, ICurrentVersions } from '../@types/index'
import { getBlock } from './utils/ethers'
import latestRelease from './utils/github'
import cexaStatus from './services/cexa'
import eventMonitorStatus from './services/event-monitor'
import { insertMany } from '../db/elasticsearch'

async function getNetwordStatus(
  network: INetwork,
  currentVersions: ICurrentVersions
): Promise<IStatus> {
  console.log(`Starting checking componentes for ${network.name}`)
  console.time(`Finished checking componentes for ${network.name}`)
  const currentBlock = await getBlock(network)

  const status: IStatus = {
    network: network.name,
    lastUpdatedOn: Date.now(),
    currentBlock,
    components: [
      await subgraphStatus(
        network,
        currentBlock,
        currentVersions.subgraphLatestVersion
      ),
      await providerStatus(network.name, currentVersions.providerLatestVersion),
      await eventMonitorStatus(
        network,
        currentBlock,
        currentVersions.aquariusLatestVersion
      )
    ]
  }
  network.faucetWallet &&
    network.rpcUrl &&
    status.components.push(await faucetStatus(network))

  console.timeEnd(`Finished checking componentes for ${network.name}`)
  return status
}

async function getGeneralAppsStatus(
  currentVersions: ICurrentVersions,
  networks: INetwork[]
): Promise<IStatus> {
  const generalStatus: IStatus = {
    network: 'general',
    lastUpdatedOn: Date.now(),
    components: [
      await marketStatus(),
      await dfStatus(),
      await cexaStatus(),
      await aquariusStatus(networks, currentVersions.aquariusLatestVersion),
      await operatorStatus(currentVersions.operatorLatestVersion)
    ]
  }

  return generalStatus
}

export default async function monitor(): Promise<string> {
  if (!process.env.NETWORKS) {
    return 'No network data provided'
  }
  console.log(`Started checking the components`)
  console.time(`Updated status for all networks`)
  const networks: INetwork[] = JSON.parse(process.env.NETWORKS)

  const currentVersions: ICurrentVersions = {
    providerLatestVersion: await latestRelease('provider'),
    aquariusLatestVersion: await latestRelease('aquarius'),
    subgraphLatestVersion: await latestRelease('ocean-subgraph'),
    operatorLatestVersion: await latestRelease('operator-service')
  }

  const allStatuses: IStatus[] = []

  allStatuses.push(await getGeneralAppsStatus(currentVersions, networks))
  try {
    const promise: Promise<IStatus>[] = []
    for (let i = 0; i < networks.length; i++) {
      const network: INetwork = networks[i]

      promise.push(getNetwordStatus(network, currentVersions))
    }

    const results = await Promise.all(promise)
    allStatuses.push(...results)

    // send notification email
    // notification(allStatuses)
    // Update DB
    const response = await insertMany(allStatuses)
    console.timeEnd(`Updated status for all networks`)
    return response
  } catch (error) {
    const response = String(error)
    console.log('# error: ', response)
    return `ERROR: ${response}`
  }
}
