import fetch from 'cross-fetch'
import { IOperatorStatus, State } from '../../@types'
import { getVersionMissmatchError } from '../utils/messages'

export default async function operatorStatus(
  chainId: string,
  latestRelease: string
): Promise<IOperatorStatus> {
  const status: IOperatorStatus = { limitReached: false }
  const response = await fetch(`https://stagev4.c2d.oceanprotocol.com`)
  const operatorStatus = await response.json()
  const c2dEnvironment = process.env.C2D_ENVIRONMENTS
    ? process.env.C2D_ENVIRONMENTS
    : '2'
  status.response = response.status
  status.version = operatorStatus.version

  status.latestRelease = latestRelease

  const environment = await fetch(
    `https://stagev4.c2d.oceanprotocol.com/api/v1/operator/environments?chainId=${chainId}`
  )
  const environmentData = await environment.json()
  status.environments = environmentData.length

  let maxJobs = 0
  environmentData.forEach((environment) => {
    maxJobs += environment.maxJobs
    if (environment.currentJobs >= environment.maxJobs)
      return (status.limitReached = true)
  })
  const statusMessages = []
  if (status.response !== 200 || status.environments < Number(c2dEnvironment))
    status.status = State.Down
  else if (status.limitReached === true) {
    statusMessages.push(
      `Maximum job limit of ${maxJobs.toString()} has been reached`
    )
    status.status = State.Warning
  } else status.status = State.Up

  if (status.version !== status.latestRelease)
    statusMessages.push(
      getVersionMissmatchError(
        'Operator service',
        status.version,
        status.latestRelease
      )
    )

  status.statusMessages = statusMessages.toString()
  return status
}
