import { Response } from 'express'
import fetch from 'cross-fetch'

import { insert } from './db'

async function aquariusStatus() {
  console.log('get aquariusStatus')
  return true
}

async function providerStatus() {
  console.log('get aquariusStatus')
  return true
}

async function subgraphStatus() {
  console.log('get aquariusStatus')
  return true
}

async function marketStatus() {
  try {
    console.log('get market Status')
    const response = await fetch('https://market.oceanprotocol.com/')
    console.log('market', response.status)
    if (response.status) return 'UP'
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

async function portStatus() {
  console.log('get aquariusStatus')
  return true
}

export default async function monitor(res: Response) {
  try {
    console.log('monitor')
    const market = await marketStatus()
    console.log('market: ', market)

    // Update DB
    await insert({ market, lastUpdatedOn: Date.now() }, (result) =>
      console.log(result)
    )
    const test = '123'
    res.send({ test })
  } catch (error) {
    console.log('error: ', error)
    res.send(error)
  }
}
