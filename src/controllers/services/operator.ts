import fetch from 'cross-fetch'
import latestRelease from '../utils/github'
import { OperatorStatus, State } from '../../@types'

export default async function operatorStatus(
  chainId: string
): Promise<OperatorStatus> {
  const status: OperatorStatus = { limitReached: false }
  const response = await fetch(`https://stagev4.c2d.oceanprotocol.com`)
  const operatorStatus = await response.json()
  status.response = response.status
  status.version = operatorStatus.version

  status.latestRelease = await latestRelease('operator-service')

  const environment = await fetch(
    `https://stagev4.c2d.oceanprotocol.com/api/v1/operator/environments?chainId=${chainId}`
  )
  const environmentData = await environment.json()
  status.environments = environmentData.length

  environmentData.forEach((environment) => {
    if (environment.currentJobs >= environment.maxJobs)
      return (status.limitReached = true)
  })

  if (
    status.response !== 200 ||
    status.environments < Number(process.env.C2D_ENVIRONMENTS)
  )
    status.status = State.Down
  else if (
    status.version !== status.latestRelease ||
    status.limitReached === true
  )
    status.status = State.Warning
  else status.status = State.Up

  return status
}
