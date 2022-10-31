import { assert } from 'chai'
import { IStatus, ISummary, State } from '../src/@types'
import request from 'supertest'
import app from '../src/app'
import { insertMany } from '../src/db/elasticsearch'
import 'dotenv/config'

describe('Monitoring App Tests', function () {
  this.timeout(300000)
  const recentBlock = Math.floor(Math.random() * 1000000)
  const date = Date.now()

  const exampleStatus = (
    network: string,
    state1: State,
    state2: State
  ): IStatus => {
    const status: IStatus = {
      network: network,
      currentBlock: recentBlock,
      components: [
        {
          name: 'market',
          status: state1,
          response: 200
        },
        {
          name: 'dataFarming',
          status: state1,
          response: 200
        },
        {
          name: 'provider',
          status: state1,
          response: 200,
          version: '1.0.20',
          latestRelease: '1.3.4'
        },
        {
          name: 'subgraph',
          version: '2.1.3',
          latestRelease: '2.1.3',
          response: 200,
          status: state2,
          block: recentBlock
        },
        {
          name: 'aquarius',
          response: 200,
          version: '4.4.2',
          latestRelease: '4.5.1',
          validChainList: true,
          block: recentBlock,
          validQuery: true,
          status: state1
        },
        {
          name: 'operator',
          limitReached: false,
          response: 200,
          version: '1.0.1',
          latestRelease: '1.0.1',
          environments: 2,
          status: state2
        }
      ],

      lastUpdatedOn: date
    }
    return status
  }

  it('Force update the current status of all Ocean components', async () => {
    const response = await request(app).get('/forceUpdate').expect(200)

    assert(
      response.body.response === 'status inserted into ElasticSearch',
      'Failed to monitor services and update DB'
    )
  })
  it('Updates database', async () => {
    const dbResponse = await insertMany([
      exampleStatus('mainnet', State.Normal, State.Outage),
      exampleStatus('polygon', State.Outage, State.Degraded),
      exampleStatus('bsc', State.Normal, State.Outage),
      exampleStatus('energyweb', State.Outage, State.Degraded),
      exampleStatus('moonriver', State.Normal, State.Outage)
    ])

    assert(
      dbResponse === 'status inserted into ElasticSearch',
      'Failed to update DB'
    )
  })
})
