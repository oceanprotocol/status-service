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
  const release = await latestRelease('aquarius')

  const chainResponse = await fetch(
    'https://v4.aquarius.oceanprotocol.com/api/aquarius/chains/list'
  )
  status.chain = (await chainResponse.json())[network.chainId]

  const chainStatus = await fetch(
    `https://v4.aquarius.oceanprotocol.com/api/aquarius/chains/status/${network.chainId}`
  )

  status.block = (await chainStatus.json()).last_block

  let blockNum: number
  if (network.name && network.infuraId) {
    blockNum = await getBlock(network)
  }

  const validQuery = await aquariusQuery(network.chainId)

  if (status.response !== 200 || !status.chain || validQuery)
    status.status = 'DOWN'
  else if (
    status.version !== release ||
    !status.chain ||
    blockNum >= status.block + Number(process.env.BLOCK_TOLERANCE)
  )
    status.status = 'WARNING'
  else status.status = 'UP'
  return status
}
