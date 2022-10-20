import fetch from 'cross-fetch'
import { IComponentStatus, State } from '../../@types'

export default async function marketStatus(): Promise<IComponentStatus> {
  try {
    const response = await fetch('https://market.oceanprotocol.com/')

    return {
      name: 'market',
      status: response.status === 200 ? State.Normal : State.Outage,
      response: response.status,
      url: 'https://market.oceanprotocol.com/'
    }
  } catch (error) {
    const response = String(error)
    console.log(`marketStatus error: ${response} `)
  }
}
