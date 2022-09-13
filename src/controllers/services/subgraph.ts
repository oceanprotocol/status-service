import fetch from 'cross-fetch'
import { Network, SubgraphStatus } from '../../@types'
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

const query = `{
    globalStatistics{version}
    _meta{ block { number } }
    nfts{
      id,
      symbol,
      name,
      tokenUri,
      owner,
      creator,
      address,
      providerUrl,
      assetState,
      managerRole,
      erc20DeployerRole,
      storeUpdateRole,
      metadataRole,
      template,
      transferable,
      createdTimestamp,
      tx,
      block,
      orderCount
    }
    fixedRateExchanges{
      id
      contract
      exchangeId
      owner {
        id
      }
      datatoken {
        id
      }
      baseToken {
        id
      }
      datatokenSupply
      baseTokenSupply
      datatokenBalance
      baseTokenBalance
      price
      active
      totalSwapValue
      allowedSwapper
      withMint
      isMinter
      updates {
        id
      }
      swaps {
        id
      }
      createdTimestamp
      tx
      block
      publishMarketFeeAddress
      publishMarketSwapFee
    }
  }`

export default async function subgraphStatus(
  network: Network
): Promise<SubgraphStatus> {
  const subgraphStatus: SubgraphStatus = {}
  const response = await subgraphFetch(network.name, query)
  const data = (await response.json()).data
  console.log(data)
  subgraphStatus.block = data._meta.block.number

  let web3Provider: ethers.providers.Provider
  let blockNum: number

  if (network.name && network.infuraId) {
    web3Provider = getWeb3Provider(network)
    blockNum = await web3Provider.getBlockNumber()
  }

  subgraphStatus.version = data.globalStatistics[0].version
  const release = await latestRelease('ocean-subgraph')
  subgraphStatus.response = response.status

  if (
    subgraphStatus.response === 200 &&
    subgraphStatus.version === release &&
    blockNum <= subgraphStatus.block + Number(process.env.BLOCK_TOLERANCE)
  )
    subgraphStatus.status = 'UP'
  else if (response.status === 200) subgraphStatus.status = 'WARNING'
  else subgraphStatus.status = 'DOWN'

  return subgraphStatus
}
