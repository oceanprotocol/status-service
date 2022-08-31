import { Response } from 'express'
import 'dotenv/config'

import { insert } from './db'
import aquariusStatus from './aquarius'
import marketStatus from './market'
import portStatus from './port'

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
  console.log('monitor', process.env.NETWORKS)
  const networks = JSON.parse(process.env.NETWORKS)
  console.log('networks', networks)
  const market = await marketStatus()
  const port = await portStatus()
  try {
    networks.forEach(async (network) => {
      console.log('network', network)
      const status: Status = { network }
      status.market = market
      status.port = port
      status.aquarius = await aquariusStatus()
      console.log({ status })
      // Update DB
      await insert(status, (result) => console.log(result))
    })

    res.send({ response: 'Database has been updated' })
  } catch (error) {
    console.log('error: ', error)
    res.send(error)
  }
}
