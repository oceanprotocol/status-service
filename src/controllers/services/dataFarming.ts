import fetch from 'cross-fetch'
import { IComponentStatus, State } from '../../@types'

export default async function dfStatus(): Promise<IComponentStatus> {
  try {
    const response = await fetch('https://df.oceandao.org/rewards')
    return {
      name: 'data-farming',
      status: response.status === 200 ? State.Normal : State.Outage,
      response: response.status,
      url: 'https://df.oceandao.org/'
    }
  } catch (error) {
    const response = String(error)
    console.log('dfStatus error: ', response)
  }
}
