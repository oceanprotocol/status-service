import { Response } from 'express'
import 'dotenv/config'

import { insert } from './db'
import aquariusStatus from './services/aquarius'
import marketStatus from './services/market'
import portStatus from './services/port'
import providerStatus from './services/provider'
import subgraphStatus from './services/subgraph'
import operatorStatus from './services/operatorService'
import faucetStatus from './services/faucet'
import dfStatus from './services/dataFarming'
import grantsStatus from './services/daoGrants'
import { Status, Network } from '../@types/index'
import notification from './notification'
import { getBlock } from './utils/ethers'

export default async function monitor(): Promise<string> {
  const networks: Network[] = JSON.parse(process.env.NETWORKS)
  const market = await marketStatus()
  const port = await portStatus()
  const dataFarming = await dfStatus()
  const daoGrants = await grantsStatus()
  try {
    for (let i = 0; i < networks.length; i++) {
      const network: Network = networks[i]
      const currentBlock = await getBlock(network)
      const provider = await providerStatus(network.name)
      const subgraph = await subgraphStatus(network, currentBlock)
      const aquarius = await aquariusStatus(network, currentBlock)
      const operatorService = await operatorStatus(network.chainId)

      const status: Status = {
        network: network.name,
        currentBlock,
        market,
        port,
        dataFarming,
        daoGrants,
        faucet: {},
        provider,
        subgraph,
        aquarius,
        operatorService
      }

      if (network.faucetWallet && network.rpcUrl)
        status.faucet = await faucetStatus(network)

      // Update DB
      insert(status)
      // send notification email
      notification(status)
    }

    return 'Database has been updated'
  } catch (error) {
    console.log('error: ', error)
    return error
  }
}
