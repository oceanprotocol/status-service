import { Response } from 'express'
import 'dotenv/config'

import { insert } from './db'
import aquariusStatus from './services/aquarius'
import marketStatus from './services/market'
import portStatus from './services/port'
import providerStatus from './services/provider'

interface Status {
  network: string
  aquarius?: string
  provider?: string
  subgraph?: 'UP' | 'DOWN' | 'WARNING'
  market?: 'UP' | 'DOWN'
  port?: 'UP' | 'DOWN'
  faucet?: string
  operatorEngine?: string
}

export default async function monitor(res: Response) {
  const networks = JSON.parse(process.env.NETWORKS)
  const market = await marketStatus()
  const port = await portStatus()
  const aquarius = await aquariusStatus()
  try {
    for (let i = 0; i < networks.length; i++) {
      console.log('i', i)
      const network = networks[i]
      console.log('network', network)
      const status: Status = { network }
      const provider = await providerStatus(network)
      console.log('provider', provider)
      status.provider = provider
      status.market = market
      status.port = port
      status.aquarius = aquarius
      console.log({ status })
      // Update DB
      await insert(status, (result) => console.log(result))
    }

    res.send({ response: 'Database has been updated' })
  } catch (error) {
    console.log('error: ', error)
    res.send(error)
  }
}
