import fetch from 'cross-fetch'
import { Network } from '../../@types'
import getWeb3Provider from '../utils/ethers'
import latestRelease from '../utils/github'
import ethers from 'ethers'

async function subgraphFetch(network: string, query: string) {
  const response = await fetch(
    `https://v4.subgraph.${network}.oceanprotocol.com/subgraphs/name/oceanprotocol/ocean-subgraph`,
    {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query })
    }
  )
  return response
}

export default async function subgraphStatus(network: Network) {
  const query = `{globalStatistics{version} _meta{ block { number } }}`
  const response = await subgraphFetch(network.name, query)
  const data = (await response.json()).data

  const blockCheck =
    data._meta.block.number + Number(process.env.BLOCK_TOLERANCE)
  let web3Provider: ethers.providers.Provider
  let blockNum: number

  if (network.name && network.infuraId) {
    web3Provider = getWeb3Provider(network)
    blockNum = await web3Provider.getBlockNumber()
  }

  const version = data.globalStatistics[0].version
  const release = await latestRelease('ocean-subgraph')

  if (response.status === 200 && version === release && blockNum <= blockCheck)
    return 'UP'
  else if (response.status === 200) return 'WARNING'
  else return 'DOWN'
}
