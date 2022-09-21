import fetch from 'cross-fetch'
import latestRelease from '../utils/github'
import { OperatorStatus } from '../../@types'

export default async function operatorStatus(
  chainId: string
): Promise<OperatorStatus> {
  const status: OperatorStatus = {}
  const response = await fetch(`https://stagev4.c2d.oceanprotocol.com`)
  const operatorStatus = await response.json()
  status.response = response.status
  status.version = operatorStatus.version

  status.latestRelease = await latestRelease('operator-service')

  const environment = await fetch(
    `https://stagev4.c2d.oceanprotocol.com/api/v1/operator/environments?chainId=${chainId}`
  )
  const environmentData = await environment.json()
  console.log('C2D environment Data: ', environmentData)

  if (
    status.response !== 200 ||
    environmentData.length < Number(process.env.C2D_ENVIRONMENTS)
  )
    status.status = 'DOWN'
  else if (status.version !== status.latestRelease) status.status = 'WARNING'
  else status.status = 'UP'

  return status
}
