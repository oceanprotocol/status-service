import fetch from 'cross-fetch'
import { IComponentStatus, State } from '../../@types'

export default async function cexaStatus(): Promise<IComponentStatus> {
  try {
    const response = await fetch(process.env.CEX_URL)
    return {
      name: 'cexa',
      status: response.status === 200 ? State.Up : State.Down,
      response: response.status
    }
  } catch (error) {
    const response = String(error)
    console.log('cexaStatus error: ', response)
  }
}
