import fetch from 'cross-fetch'
import { IComponentStatus, State } from '../../@types'

export default async function marketStatus(): Promise<IComponentStatus> {
  try {
    const response = await fetch('https://market.oceanprotocol.com/')

    return {
      name: 'market',
      status: response.status === 200 ? State.Up : State.Down,
      response: response.status
    }
  } catch (error) {
    const response = String(error)
    console.log(`marketStatus error: ${response} `)
  }
}
