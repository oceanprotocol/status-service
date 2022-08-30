import { Response } from 'express'
import fetch from 'cross-fetch'

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
  console.log('get market Status')
  const response = await fetch('https://market.oceanprotocol.com/')
  console.log('market', response.status)
  return response.status
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

export default async function monitor(req: Request, res: Response) {
  try {
    const market = await marketStatus()
    console.log('market: ', market)
    const test = '123'
    res.send({ test })
  } catch (error) {
    console.log('error: ', error)
    res.send(error)
  }
}
