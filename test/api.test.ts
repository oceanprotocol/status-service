import request from 'supertest'
import { assert } from 'chai'
import app from '../src/app'
import { dbRow, Network } from '../src/@types'
import { getBlock } from '../src/controllers/utils/ethers'
import mail from '../src/controllers/mail'

describe('Price Request Tests', function () {
  this.timeout(240000)
  const networks: Network[] = JSON.parse(process.env.NETWORKS)
  let recentBlock: number

  it('Sends notification email', async () => {
    await mail(['market', 'provider', 'port'], true)
  })

  it('Gets the current status of Ocean services on Mainnet', async () => {
    const response = await request(app)
      .get('/mainnet')
      .expect('Content-Type', /json/)
      .expect(200)
    const row: dbRow = response.body

    console.log('Mainnet row', row)

    recentBlock = (await getBlock(networks[0])) - 60

    assert(row, 'Invalid body for mainnet')
    assert(row.network === 'mainnet', 'Invalid network for mainnet')
    assert(
      row.aquariusStatus === 'UP' || 'WARNING',
      'Invalid aquariusStatus for mainnet'
    )
    assert(row.aquariusResponse === 200, 'Invalid aquariusResponse for mainnet')
    assert(row.aquariusChain === 1, 'Invalid aquariusChain for mainnet')
    assert(row.aquariusVersion, 'Invalid aquariusVersion for mainnet')
    assert(
      row.aquariusLatestRelease,
      'Invalid aquariusLatestRelease for mainnet'
    )
    assert(row.aquariusBlock > recentBlock, 'Invalid aquariusBlock for mainnet')
    assert(
      row.aquariusValidQuery === 1,
      'Invalid aquariusValidQuery for mainnet'
    )
    assert(row.providerStatus === 'UP' || 'WARNING', 'Invalid body for mainnet')
    assert(row.providerResponse === 200, 'Invalid providerResponse for mainnet')
    assert(row.providerVersion, 'Invalid providerVersion for mainnet')
    assert(
      row.providerLatestRelease,
      'Invalid providerLatestRelease for mainnet'
    )
    assert(
      row.subgraphStatus === 'UP' || 'WARNING',
      'Invalid subgraphStatus for mainnet'
    )
    assert(row.subgraphResponse === 200, 'Invalid subgraphResponse for mainnet')
    assert(row.subgraphVersion, 'Invalid subgraphVersion for mainnet')
    assert(
      row.subgraphLatestRelease,
      'Invalid subgraphLatestRelease for mainnet'
    )
    assert(row.subgraphBlock > recentBlock, 'Invalid subgraphBlock for mainnet')
    assert(row.operatorStatus === 'UP', 'Invalid operatorStatus for mainnet')
    assert(row.operatorResponse === 200, 'Invalid operatorResponse for mainnet')
    assert(row.operatorVersion, 'Invalid operatorVersion for mainnet')
    assert(
      row.operatorLatestRelease,
      'Invalid operatorLatestRelease for mainnet'
    )
    assert(
      row.operatorEnvironments === Number(process.env.C2D_ENVIRONMENTS),
      'Invalid operatorEnvironments for mainnet'
    )
    assert(
      row.operatorLimitReached === 0,
      'Invalid operatorLimitReached for mainnet'
    )
    assert(row.market === 'UP', 'Invalid market for mainnet')
    assert(row.port === 'UP', 'Invalid port for mainnet')
    assert(row.faucet === 'N/A', 'Invalid faucet for mainnet')
    assert(row.faucetResponse === 'N/A', 'Invalid faucetResponse for mainnet')
    assert(
      row.faucetEthBalance === 'N/A',
      'Invalid faucetEthBalance for mainnet'
    )
    assert(
      row.faucetEthBalanceSufficient === 'N/A',
      'Invalid faucetEthBalanceSufficient for mainnet'
    )
    assert(
      row.faucetOceanBalance === 'N/A',
      'Invalid faucetOceanBalance for mainnet'
    )
    assert(
      row.faucetOceanBalanceSufficient === 'N/A',
      'Invalid faucetOceanBalanceSufficient for mainnet'
    )
    assert(
      row.lastUpdatedOn > Date.now() - 50000000,
      'Invalid lastUpdatedOn for mainnet'
    )
  })

  it('Gets the current status of Ocean services on Polygon', async () => {
    const response = await request(app)
      .get('/polygon')
      .expect('Content-Type', /json/)
      .expect(200)

    const row: dbRow = response.body
    recentBlock = 10000 /// (await getBlock(networks[1])) - 60

    console.log('Mainnet row', row)

    assert(row, 'Invalid body for Polygon')
    assert(row.network === 'polygon', 'Invalid network for Polygon')
    assert(
      row.aquariusStatus === 'UP' || 'WARNING',
      'Invalid aquariusStatus for Polygon'
    )
    assert(row.aquariusResponse === 200, 'Invalid aquariusResponse for mainnet')
    assert(row.aquariusChain === 1, 'Invalid aquariusChain for Polygon')
    assert(row.aquariusVersion, 'Invalid aquariusVersion for Polygon')
    assert(
      row.aquariusLatestRelease,
      'Invalid aquariusLatestRelease for Polygon'
    )
    assert(row.aquariusBlock > recentBlock, 'Invalid aquariusBlock for Polygon')
    assert(
      row.aquariusValidQuery === 1,
      'Invalid aquariusValidQuery for Polygon'
    )
    assert(row.providerStatus === 'UP' || 'WARNING', 'Invalid body for Polygon')
    assert(row.providerResponse === 200, 'Invalid providerResponse for Polygon')
    assert(row.providerVersion, 'Invalid providerVersion for Polygon')
    assert(
      row.providerLatestRelease,
      'Invalid providerLatestRelease for Polygon'
    )
    assert(
      row.subgraphStatus === 'UP' || 'WARNING',
      'Invalid subgraphStatus for Polygon'
    )
    assert(row.subgraphResponse === 200, 'Invalid subgraphResponse for Polygon')
    assert(row.subgraphVersion, 'Invalid subgraphVersion for Polygon')
    assert(
      row.subgraphLatestRelease,
      'Invalid subgraphLatestRelease for Polygon'
    )
    assert(row.subgraphBlock > recentBlock, 'Invalid subgraphBlock for Polygon')
    assert(row.operatorStatus === 'UP', 'Invalid operatorStatus for Polygon')
    assert(row.operatorResponse === 200, 'Invalid operatorResponse for Polygon')
    assert(row.operatorVersion, 'Invalid operatorVersion for Polygon')
    assert(
      row.operatorLatestRelease,
      'Invalid operatorLatestRelease for Polygon'
    )
    assert(
      row.operatorEnvironments === Number(process.env.C2D_ENVIRONMENTS),
      'Invalid operatorEnvironments for Polygon'
    )
    assert(
      row.operatorLimitReached === 0,
      'Invalid operatorLimitReached for Polygon'
    )
    assert(row.market === 'UP', 'Invalid market for Polygon')
    assert(row.port === 'UP', 'Invalid port for Polygon')
    assert(row.faucet === 'N/A', 'Invalid faucet for Polygon')
    assert(row.faucetResponse === 'N/A', 'Invalid faucetResponse for Polygon')
    assert(
      row.faucetEthBalance === 'N/A',
      'Invalid faucetEthBalance for Polygon'
    )
    assert(
      row.faucetEthBalanceSufficient === 'N/A',
      'Invalid faucetEthBalanceSufficient for Polygon'
    )
    assert(
      row.faucetOceanBalance === 'N/A',
      'Invalid faucetOceanBalance for Polygon'
    )
    assert(
      row.faucetOceanBalanceSufficient === 'N/A',
      'Invalid faucetOceanBalanceSufficient for Polygon'
    )
    assert(
      row.lastUpdatedOn > Date.now() - 50000000,
      'Invalid lastUpdatedOn for Polygon'
    )
  })

  it('Monitors the current status of OCEAN', async () => {
    const response = await request(app)
      .get('/forceUpdate')
      .expect('Content-Type', /json/)
      .expect(200)

    assert(
      response.body.response === 'Database has been updated',
      'Failed to monitor services and update DB'
    )
  })
})
