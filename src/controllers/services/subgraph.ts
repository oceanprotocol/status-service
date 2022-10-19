import fetch from 'cross-fetch'
import { INetwork, State, IComponentStatus } from '../../@types'
import {
  getBlockMissmatchError,
  getVersionMissmatchError
} from '../utils/messages'

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
  currentBlock: number,
  latestRelease: string
): Promise<IComponentStatus> {
  const subgraphStatus: IComponentStatus = {
    name: 'subgraph',
    status: State.Down,
    response: 500
  }
  try {
    const response = await subgraphFetch(network.name, query)
    const data = (await response.json()).data
    subgraphStatus.block = data._meta.block.number

    subgraphStatus.version = data.globalStatistics[0].version
    subgraphStatus.latestRelease = latestRelease
    subgraphStatus.response = response.status

    const blockTolerance = process.env.BLOCK_TOLERANCE
      ? process.env.BLOCK_TOLERANCE
      : '100'

    if (
      subgraphStatus.response !== 200 ||
      data.users.length < 1 ||
      data.tokens.length < 1 ||
      data.nfts.length < 1
    )
      subgraphStatus.status = State.Down
    else if (currentBlock >= subgraphStatus.block + Number(blockTolerance))
      subgraphStatus.status = State.Warning
    else subgraphStatus.status = State.Up

    subgraphStatus.statusMessages = []
    if (subgraphStatus.version !== subgraphStatus.latestRelease)
      subgraphStatus.statusMessages.push(
        getVersionMissmatchError(
          subgraphStatus.version,
          subgraphStatus.latestRelease
        )
      )
    if (currentBlock >= subgraphStatus.block + Number(blockTolerance))
      subgraphStatus.statusMessages.push(
        getBlockMissmatchError(
          subgraphStatus.block.toString(),
          currentBlock.toString()
        )
      )
  } catch (error) {
    const response = String(error)
    console.log(`subgraphStatus error for ${network.name}: ${response} `)
  }
  return subgraphStatus
}
