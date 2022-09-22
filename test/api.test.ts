import request from 'supertest'
import { assert } from 'chai'
import app from '../src/app'
import { dbRow, Network } from '../src/@types'
import { getBlock } from '../src/controllers/utils/ethers'

describe('Price Request Tests', function () {
  this.timeout(240000)
  const networks: Network[] = JSON.parse(process.env.NETWORKS)
  let recentBlock: number

  it('Gets the current status of Ocean services on Mainnet', async () => {
    const response = await request(app)
      .get('/mainnet')
      .expect('Content-Type', /json/)
      .expect(200)
    const row: dbRow = response.body

    console.log('Mainnet row', row)

    recentBlock = (await getBlock(networks[0])) - 60

    assert(response.body, 'Invalid body for mainnet')
    assert(response.network === 'mainnet', 'Invalid network for mainnet')
    assert(
      response.aquariusStatus === 'UP' || 'WARNING',
      'Invalid aquariusStatus for mainnet'
    )
    assert(
      response.aquariusResponse === 200,
      'Invalid aquariusResponse for mainnet'
    )
    assert(response.aquariusChain === 1, 'Invalid aquariusChain for mainnet')
    assert(response.aquariusVersion, 'Invalid aquariusVersion for mainnet')
    assert(
      response.aquariusLatestRelease,
      'Invalid aquariusLatestRelease for mainnet'
    )
    assert(
      response.aquariusBlock > recentBlock,
      'Invalid aquariusBlock for mainnet'
    )
    assert(
      response.aquariusValidQuery === 1,
      'Invalid aquariusValidQuery for mainnet'
    )
    assert(
      response.providerStatus === 'UP' || 'WARNING',
      'Invalid body for mainnet'
    )
    assert(
      response.providerResponse === 200,
      'Invalid providerResponse for mainnet'
    )
    assert(response.providerVersion, 'Invalid providerVersion for mainnet')
    assert(
      response.providerLatestRelease,
      'Invalid providerLatestRelease for mainnet'
    )
    assert(
      response.subgraphStatus === 'UP' || 'WARNING',
      'Invalid subgraphStatus for mainnet'
    )
    assert(
      response.subgraphResponse === 200,
      'Invalid subgraphResponse for mainnet'
    )
    assert(response.subgraphVersion, 'Invalid subgraphVersion for mainnet')
    assert(
      response.subgraphLatestRelease,
      'Invalid subgraphLatestRelease for mainnet'
    )
    assert(
      response.subgraphBlock > recentBlock,
      'Invalid subgraphBlock for mainnet'
    )
    assert(
      response.operatorStatus === 'UP',
      'Invalid operatorStatus for mainnet'
    )
    assert(
      response.operatorResponse === 200,
      'Invalid operatorResponse for mainnet'
    )
    assert(response.operatorVersion, 'Invalid operatorVersion for mainnet')
    assert(
      response.operatorLatestRelease,
      'Invalid operatorLatestRelease for mainnet'
    )
    assert(
      response.operatorEnvironments === process.env.C2D_ENVIRONMENTS,
      'Invalid operatorEnvironments for mainnet'
    )
    assert(
      response.operatorLimitReached === 0,
      'Invalid operatorLimitReached for mainnet'
    )
    assert(response.market === 'UP', 'Invalid market for mainnet')
    assert(response.port === 'UP', 'Invalid port for mainnet')
    assert(response.faucet === 'N/A', 'Invalid faucet for mainnet')
    assert(
      response.faucetResponse === 'N/A',
      'Invalid faucetResponse for mainnet'
    )
    assert(
      response.faucetEthBalance === 'N/A',
      'Invalid faucetEthBalance for mainnet'
    )
    assert(
      response.faucetEthBalanceSufficient === 'N/A',
      'Invalid faucetEthBalanceSufficient for mainnet'
    )
    assert(
      response.faucetOceanBalance === 'N/A',
      'Invalid faucetOceanBalance for mainnet'
    )
    assert(
      response.faucetOceanBalanceSufficient === 'N/A',
      'Invalid faucetOceanBalanceSufficient for mainnet'
    )
    assert(
      response.lastUpdatedOn > Date.now() - 500,
      'Invalid lastUpdatedOn for mainnet'
    )
  })

  it('Gets the current status of Ocean services on Polygon', async () => {
    const response = await request(app)
      .get('/polygon')
      .expect('Content-Type', /json/)
      .expect(200)

    const row: dbRow = response.body
    recentBlock = (await getBlock(networks[1])) - 60

    console.log('Mainnet row', row)

    assert(response.body, 'Invalid body for Polygon')
    assert(response.network === 'mainnet', 'Invalid network for Polygon')
    assert(
      response.aquariusStatus === 'UP' || 'WARNING',
      'Invalid aquariusStatus for Polygon'
    )
    assert(
      response.aquariusResponse === 200,
      'Invalid aquariusResponse for mainnet'
    )
    assert(response.aquariusChain === 1, 'Invalid aquariusChain for Polygon')
    assert(response.aquariusVersion, 'Invalid aquariusVersion for Polygon')
    assert(
      response.aquariusLatestRelease,
      'Invalid aquariusLatestRelease for Polygon'
    )
    assert(
      response.aquariusBlock > recentBlock,
      'Invalid aquariusBlock for Polygon'
    )
    assert(
      response.aquariusValidQuery === 1,
      'Invalid aquariusValidQuery for Polygon'
    )
    assert(
      response.providerStatus === 'UP' || 'WARNING',
      'Invalid body for Polygon'
    )
    assert(
      response.providerResponse === 200,
      'Invalid providerResponse for Polygon'
    )
    assert(response.providerVersion, 'Invalid providerVersion for Polygon')
    assert(
      response.providerLatestRelease,
      'Invalid providerLatestRelease for Polygon'
    )
    assert(
      response.subgraphStatus === 'UP' || 'WARNING',
      'Invalid subgraphStatus for Polygon'
    )
    assert(
      response.subgraphResponse === 200,
      'Invalid subgraphResponse for Polygon'
    )
    assert(response.subgraphVersion, 'Invalid subgraphVersion for Polygon')
    assert(
      response.subgraphLatestRelease,
      'Invalid subgraphLatestRelease for Polygon'
    )
    assert(
      response.subgraphBlock > recentBlock,
      'Invalid subgraphBlock for Polygon'
    )
    assert(
      response.operatorStatus === 'UP',
      'Invalid operatorStatus for Polygon'
    )
    assert(
      response.operatorResponse === 200,
      'Invalid operatorResponse for Polygon'
    )
    assert(response.operatorVersion, 'Invalid operatorVersion for Polygon')
    assert(
      response.operatorLatestRelease,
      'Invalid operatorLatestRelease for Polygon'
    )
    assert(
      response.operatorEnvironments === process.env.C2D_ENVIRONMENTS,
      'Invalid operatorEnvironments for Polygon'
    )
    assert(
      response.operatorLimitReached === 0,
      'Invalid operatorLimitReached for Polygon'
    )
    assert(response.market === 'UP', 'Invalid market for Polygon')
    assert(response.port === 'UP', 'Invalid port for Polygon')
    assert(response.faucet === 'N/A', 'Invalid faucet for Polygon')
    assert(
      response.faucetResponse === 'N/A',
      'Invalid faucetResponse for Polygon'
    )
    assert(
      response.faucetEthBalance === 'N/A',
      'Invalid faucetEthBalance for Polygon'
    )
    assert(
      response.faucetEthBalanceSufficient === 'N/A',
      'Invalid faucetEthBalanceSufficient for Polygon'
    )
    assert(
      response.faucetOceanBalance === 'N/A',
      'Invalid faucetOceanBalance for Polygon'
    )
    assert(
      response.faucetOceanBalanceSufficient === 'N/A',
      'Invalid faucetOceanBalanceSufficient for Polygon'
    )
    assert(
      response.lastUpdatedOn > Date.now() - 500,
      'Invalid lastUpdatedOn for Polygon'
    )
  })

  it('Monitors the current status of OCEAN', async () => {
    const response = await request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200)

    assert(
      response.body.response === 'Database has been updated',
      'Failed to monitor services and update DB'
    )
  })
})
