import fetch from 'cross-fetch'
import latestRelease from '../utils/github'

export default async function aquariusStatus(): Promise<
  'UP' | 'DOWN' | 'WARNING'
> {
  const response = await fetch('https://v4.aquarius.oceanprotocol.com/')
  const version = (await response.json()).version
  const release = await latestRelease('aquarius')

  if (response.status === 200 && version === release) return 'UP'
  else if (response.status === 200) return 'WARNING'
  else return 'DOWN'
}
