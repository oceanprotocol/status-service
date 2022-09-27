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

export default async function monitor(): Promise<string> {
  const networks: Network[] = JSON.parse(process.env.NETWORKS)
  const market = await marketStatus()
  const port = await portStatus()
  const dataFarming = await dfStatus()
  const daoGrants = await grantsStatus()
  try {
    for (let i = 0; i < networks.length; i++) {
      const network: Network = networks[i]
      const status: Status = { network: network.name }

      if (network.faucetWallet && network.rpcUrl)
        status.faucet = await faucetStatus(network)
      else
        status.faucet = {
          status: 'N/A',
          response: 'N/A',
          ethBalance: 'N/A',
          ethBalanceSufficient: 'N/A',
          oceanBalance: 'N/A',
          oceanBalanceSufficient: 'N/A'
        }

      status.provider = await providerStatus(network.name)
      status.subgraph = await subgraphStatus(network)
      status.aquarius = await aquariusStatus(network)
      status.operatorService = await operatorStatus(network.chainId)
      status.market = market
      status.port = port
      status.dataFarming = dataFarming
      status.daoGrants = daoGrants

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
