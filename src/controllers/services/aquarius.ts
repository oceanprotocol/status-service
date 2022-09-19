import fetch from 'cross-fetch'
import { Network, AquariusStatus } from '../../@types'
import latestRelease from '../utils/github'

async function checkChains(chainId: string): Promise<boolean> {
  try {
    const response = await fetch(
      'https://v4.aquarius.oceanprotocol.com/api/aquarius/chains/list'
    )
    const networks = await response.json()
    return networks[chainId]
  } catch (error) {
    console.log('error', error)
  }

  return true
}

export default async function aquariusStatus(
  network: Network
): Promise<AquariusStatus> {
  const status: AquariusStatus = {}
  status.chain = await checkChains(network.chainId)

  const response = await fetch('https://v4.aquarius.oceanprotocol.com/')
  status.response = response.status
  status.version = (await response.json()).version
  const release = await latestRelease('aquarius')

  if (status.response !== 200 || !status.chain) status.status = 'DOWN'
  else if (status.version !== release) status.status = 'WARNING'
  else status.status = 'UP'
  return status
}
