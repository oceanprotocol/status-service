import { Response } from 'express'
import 'dotenv/config'

import { insert } from './db'
import aquariusStatus from './services/aquarius'
import marketStatus from './services/market'
import portStatus from './services/port'
import providerStatus from './services/provider'
import subgraphStatus from './services/subgraph'
import faucetStatus from './services/faucet'
import { FaucetStatus, Status } from '../@types/index'

export default async function monitor(res: Response) {
  const networks = JSON.parse(process.env.NETWORKS)
  const market = await marketStatus()
  const port = await portStatus()
  const aquarius = await aquariusStatus()
  try {
    for (let i = 0; i < networks.length; i++) {
      const network = networks[i].name
      const status: Status = { network }

      if (networks[i].test && networks[i].infuraId) {
        console.log('check faucet')
        const faucet: FaucetStatus = await faucetStatus(
          network,
          networks[i].faucetWallet,
          networks[i].infuraId
        )
        console.log('faucet', faucet)
        status.faucet = faucet
      }
      status.provider = await providerStatus(network)
      status.subgraph = await subgraphStatus(network)
      status.market = market
      status.port = port
      status.aquarius = aquarius
      console.log({ status })
      // Update DB
      await insert(status)
    }

    res.send({ response: 'Database has been updated' })
  } catch (error) {
    console.log('error: ', error)
    res.send(error)
  }
}