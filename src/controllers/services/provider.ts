import fetch from 'cross-fetch'
import latestRelease from '../utils/github'
import { ProviderStatus } from '../../@types'

export default async function providerStatus(
  network: string
): Promise<ProviderStatus> {
  const providerStatus: ProviderStatus = {}
  const response = await fetch(
    `https://v4.provider.${network}.oceanprotocol.com/`
  )
  providerStatus.version = (await response.json()).version
  const release = await latestRelease('provider')

  if (response.status === 200 && providerStatus.version === release)
    providerStatus.status = 'UP'
  else if (response.status === 200) providerStatus.status = 'WARNING'
  else providerStatus.status = 'DOWN'

  return providerStatus
}
