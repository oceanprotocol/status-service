import fetch from 'cross-fetch'
import { IComponentStatus, State } from '../../@types'

export default async function cexaStatus(): Promise<IComponentStatus> {
  const status: IComponentStatus = {
    name: 'cexa',
    status: State.Outage,
    response: 500
  }
  try {
    const response = await fetch(process.env.CEX_URL)
    status.status = response.status === 200 ? State.Normal : State.Outage
    status.response = response.status
    return status
  } catch (error) {
    const response = String(error)
    console.log('cexaStatus error: ', response)
    status.error = response
  }
  return status
}
