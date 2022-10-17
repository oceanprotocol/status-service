import fetch from 'cross-fetch'
import { IAquariusStatus, INetwork, State } from '../../@types/index'
import latestRelease from '../utils/github'

async function aquariusQuery(chainId: string): Promise<boolean> {
  const response = await fetch(
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
  const data = await response.json()

  if (data.hits.hits.length > 0) return true
  else return false
}

export default async function aquariusStatus(
  network: INetwork,
  currentBlock: number
): Promise<IAquariusStatus> {
  const status: IAquariusStatus = {}

  const response = await fetch('https://v4.aquarius.oceanprotocol.com/')
  status.response = response.status
  status.version = (await response.json()).version
  status.latestRelease = await latestRelease('aquarius')

  const chainResponse = await fetch(
    'https://v4.aquarius.oceanprotocol.com/api/aquarius/chains/list'
  )
  status.validChainList = (await chainResponse.json())[network.chainId]

  const chainStatus = await fetch(
    `https://v4.aquarius.oceanprotocol.com/api/aquarius/chains/status/${network.chainId}`
  )
  const chainStatusData = await chainStatus.json()

  status.block = chainStatusData.last_block
  chainStatusData.version
    ? (status.monitorVersion = chainStatusData.version)
    : (status.monitorVersion = 'N/A')

  status.validQuery = await aquariusQuery(network.chainId)

  const blockTolerance = process.env.BLOCK_TOLERANCE
    ? process.env.BLOCK_TOLERANCE
    : '100'

  if (status.response !== 200 || !status.validQuery) status.status = State.Down
  else if (
    status.version !== status.latestRelease ||
    status.monitorVersion !== status.latestRelease ||
    !status.validChainList ||
    currentBlock >= status.block + Number(blockTolerance)
  )
    status.status = State.Warning
  else status.status = State.Up
  return status
}
