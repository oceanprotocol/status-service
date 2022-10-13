import fetch from 'cross-fetch'
import { INetwork, State, ISubgraphStatus } from '../../@types'
import latestRelease from '../utils/github'

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
    users{    
      id
      tokenBalancesOwned {id}
      orders {id}
      freSwaps {id}
      totalOrders
      totalSales
      __typename
    }
    tokens{    
      id,
      symbol,
      name,
      decimals,
      address,
      cap,
      supply,
      isDatatoken,
      nft {id},
      minter,
      paymentManager,
      paymentCollector,
      publishMarketFeeAddress,
      publishMarketFeeAmount,
      templateId,
      holderCount,
      orderCount,
      orders {id},
      fixedRateExchanges {id},
      dispensers {id},
      createdTimestamp,
      tx,
      block,
      lastPriceToken,
      lastPriceValue
    }
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
  network: INetwork,
  currentBlock: number
): Promise<ISubgraphStatus> {
  const subgraphStatus: ISubgraphStatus = {}
  const response = await subgraphFetch(network.name, query)
  const data = (await response.json()).data
  subgraphStatus.block = data._meta.block.number

  subgraphStatus.version = data.globalStatistics[0].version
  subgraphStatus.latestRelease = await latestRelease('ocean-subgraph')
  subgraphStatus.response = response.status

  if (
    subgraphStatus.response !== 200 ||
    data.users.length < 1 ||
    data.tokens.length < 1 ||
    data.nfts.length < 1
  )
    subgraphStatus.status = State.Down
  else if (
    currentBlock >=
      subgraphStatus.block + Number(process.env.BLOCK_TOLERANCE) ||
    subgraphStatus.version !== subgraphStatus.latestRelease
  )
    subgraphStatus.status = State.Warning
  else subgraphStatus.status = State.Up

  return subgraphStatus
}
