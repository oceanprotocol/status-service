import fetch from 'cross-fetch'
import { IAquariusStatus, INetwork, State } from '../../@types/index'
import {
  getBlockMissmatchError,
  getVersionMissmatchError
} from '../utils/messages'

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
  currentBlock: number,
  latestRelease: string
): Promise<IAquariusStatus> {
  const status: IAquariusStatus = {}

  const response = await fetch('https://v4.aquarius.oceanprotocol.com/')
  status.response = response.status
  status.version = (await response.json()).version
  status.latestRelease = latestRelease

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
    !status.validChainList ||
    currentBlock >= status.block + Number(blockTolerance)
  )
    status.status = State.Warning
  else status.status = State.Up

  status.statusMessages = []
  if (status.version !== status.latestRelease)
    status.statusMessages.push(
      getVersionMissmatchError(status.version, status.latestRelease)
    )
  if (status.monitorVersion !== status.latestRelease)
    status.statusMessages.push(
      getVersionMissmatchError(status.monitorVersion, status.latestRelease)
    )
  if (!status.validChainList)
    status.statusMessages.push(`Event monitor not defined for this network`)

  if (currentBlock >= status.block + Number(blockTolerance))
    status.statusMessages.push(
      getBlockMissmatchError(status.block.toString(), currentBlock.toString())
    )

  return status
}
