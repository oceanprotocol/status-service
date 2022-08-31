import fetch from 'cross-fetch'
import latestRelease from '../utils/github'

export default async function providerStatus(network: string) {
  const response = await fetch(
    `https://v4.provider.${network}.oceanprotocol.com/`
  )
  const version = (await response.json()).version
  const release = await latestRelease('provider')
  console.log('version', version)
  console.log('release', release)

  if (response.status === 200 && version === release) return 'UP'
  else if (response.status === 200) return 'WARNING'
  else return 'DOWN'
}
