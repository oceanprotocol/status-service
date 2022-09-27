import fetch from 'cross-fetch'
import { AquariusStatus, Network } from '../../@types'
import latestRelease from '../utils/github'
import { getBlock } from '../utils/ethers'

async function aquariusQuery(chainId: string): Promise<boolean> {
  const responcse = await fetch(
    `https://v4.aquarius.oceanprotocol.com/api/aquarius/assets/query`,
    {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: `{
        "from": 0,
        "size": 9,
        "query": {
            "bool": {
                "filter": [
                    {
                        "terms": {
                            "chainId": [
                                ${chainId}
                            ]
                        }
                    },
                    {
                        "term": {
                            "_index": "aquarius"
                        }
                    },
                    {
                        "term": {
                            "purgatory.state": false
                        }
                    }
                ]
            }
        },
        "sort": {
            "stats.orders": "desc"
        }
      }`
    }
  )
  const data = await responcse.json()

  if (data.hits.hits.length > 0) return true
  else return false
}

export default async function aquariusStatus(
  network: Network
): Promise<AquariusStatus> {
  const status: AquariusStatus = {}

  const response = await fetch('https://v4.aquarius.oceanprotocol.com/')
  status.response = response.status
  status.version = (await response.json()).version
  status.latestRelease = await latestRelease('aquarius')

  const chainResponse = await fetch(
    'https://v4.aquarius.oceanprotocol.com/api/aquarius/chains/list'
  )
  status.chain = (await chainResponse.json())[network.chainId]

  const chainStatus = await fetch(
    `https://v4.aquarius.oceanprotocol.com/api/aquarius/chains/status/${network.chainId}`
  )

  status.block = (await chainStatus.json()).last_block

  if (network.name && network.rpcUrl) {
    status.latestBlock = await getBlock(network)
  }

  status.validQuery = await aquariusQuery(network.chainId)

  if (status.response !== 200 || !status.chain || !status.validQuery)
    status.status = 'DOWN'
  else if (
    status.version !== status.latestRelease ||
    !status.chain ||
    status.latestBlock >= status.block + Number(process.env.BLOCK_TOLERANCE)
  )
    status.status = 'WARNING'
  else status.status = 'UP'
  return status
}
