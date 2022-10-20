import fetch from 'cross-fetch'
import { IComponentStatus, State } from '../../@types'
import { getVersionMissmatchError } from '../utils/messages'

export default async function operatorStatus(
  latestRelease: string
): Promise<IComponentStatus> {
  const status: IComponentStatus = {
    name: 'operator-service',
    status: State.Outage,
    response: 500,
    url: 'https://stagev4.c2d.oceanprotocol.com'
  }
  try {
    const response = await fetch(`https://stagev4.c2d.oceanprotocol.com`)
    const operatorStatus = await response.json()
    const c2dEnvironment = process.env.C2D_ENVIRONMENTS
      ? process.env.C2D_ENVIRONMENTS
      : '2'
    status.response = response.status
    status.version = operatorStatus.version

    status.latestRelease = latestRelease

    const environment = await fetch(
      `https://stagev4.c2d.oceanprotocol.com/api/v1/operator/environments?chainId=1`
    )
    const environmentData = await environment.json()
    status.environments = environmentData.length

    let maxJobs = 0
    environmentData.forEach((environment) => {
      maxJobs += environment.maxJobs
      if (environment.currentJobs >= environment.maxJobs)
        return (status.limitReached = true)
    })
    status.statusMessages = []
    if (status.response !== 200 || status.environments < Number(c2dEnvironment))
      status.status = State.Outage
    else status.status = State.Normal

    if (status.limitReached === true)
      status.statusMessages.push(
        `Maximum job limit of ${maxJobs.toString()} has been reached`
      )

    if (status.version !== status.latestRelease)
      status.statusMessages.push(
        getVersionMissmatchError(status.version, status.latestRelease)
      )
  } catch (error) {
    const response = String(error)
    console.log(`operatorStatus error: ${response} `)
  }
  return status
}
