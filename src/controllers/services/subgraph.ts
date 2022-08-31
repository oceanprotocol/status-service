import fetch from 'cross-fetch'
import latestRelease from '../utils/github'

export default async function subgraphStatus(network: string) {
  const query = `{globalStatistics{version}}`

  const response = await fetch(
    `https://v4.subgraph.${network}.oceanprotocol.com/subgraphs/name/oceanprotocol/ocean-subgraph`,
    {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query })
    }
  )
  const version = (await response.json()).data.globalStatistics[0].version
  const release = await latestRelease('ocean-subgraph')

  if (response.status === 200 && version === release) return 'UP'
  else if (response.status === 200) return 'WARNING'
  else return 'DOWN'
}
