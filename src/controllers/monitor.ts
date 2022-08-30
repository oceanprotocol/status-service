import { Response } from 'express'
import fetch from 'cross-fetch'
import 'dotenv/config'

import { insert } from './db'
import { version } from 'chai'

interface Status {
  network: string
  aquarius?: string
  provider?: string
  subgraph?: string
  market?: string
  port?: string
  faucet?: string
  operatorEngine?: string
}

async function aquariusStatus(): Promise<string> {
  console.log('get aquariusStatus')

  const response = await fetch('https://v4.aquarius.oceanprotocol.com/')
  const info = await response.json()

  const version = await fetch('https://github.com/oceanprotocol/aquarius.git')
  const versionJson = await version.json()
  console.log('aquariusStatus response', info)
  console.log('aquariusStatus version', versionJson)
  if (response.status === 200) return 'UP'
  else return 'DOWN'
}

async function providerStatus() {
  console.log('get aquariusStatus')
  return true
}

async function subgraphStatus() {
  console.log('get aquariusStatus')
  return true
}

async function marketStatus(): Promise<string> {
  try {
    const response = await fetch('https://market.oceanprotocol.com/')
    if (response.status === 200) return 'UP'
    else return 'DOWN'
  } catch (error) {
    console.log(error)
  }
}

async function faucetStatus() {
  console.log('get aquariusStatus')
  return true
}

async function operatorEngineStatus() {
  console.log('get aquariusStatus')
  return true
}

async function portStatus(): Promise<string> {
  try {
    const response = await fetch('https://port.oceanprotocol.com/')
    if (response.status === 200) return 'UP'
    else return 'DOWN'
  } catch (error) {
    console.log(error)
  }
}

export default async function monitor(res: Response) {
  try {
    const status: Status = { network: process.env.NETWORK }
    status.market = await marketStatus()
    status.port = await portStatus()
    status.aquarius = await aquariusStatus()
    console.log({ status })

    // Update DB
    const response = await insert(status, (result) => console.log(result))

    res.send({ response })
  } catch (error) {
    console.log('error: ', error)
    res.send(error)
  }
}
