import { Response } from 'express'
import 'dotenv/config'

import { insert } from './db'
import aquariusStatus from './services/aquarius'
import marketStatus from './services/market'
import portStatus from './services/port'

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
  console.log('aquarius', aquarius)
  try {
    networks.forEach(async (network) => {
      console.log('network', network)
      const status: Status = { network }
      status.market = market
      status.port = port
      status.aquarius = aquarius
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
