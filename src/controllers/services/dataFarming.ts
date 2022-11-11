import fetch from 'cross-fetch'
import { IComponentStatus, State } from '../../@types'

export default async function dfStatus(): Promise<IComponentStatus> {
  const status: IComponentStatus = {
    name: 'data-farming',
    status: State.Outage,
    response: 500,
    url: 'https://df.oceandao.org/'
  }
  try {
    const response = await fetch('https://df.oceandao.org/rewards')
    status.status = response.status === 200 ? State.Normal : State.Outage
    status.response = response.status
    return status
  } catch (error) {
    const response = String(error)
    console.log('dfStatus error: ', response)
    status.error = response
  }
  return status
}
