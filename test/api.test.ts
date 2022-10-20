import { assert } from 'chai'
import mail from '../src/controllers/mail'
import notification from '../src/controllers/notification'
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

  it('Selects no down apps when nothing is down', async () => {
    const notificationResponse = await notification([
      exampleStatus('mainnet', State.Normal, State.Normal),
      exampleStatus('polygon', State.Normal, State.Normal),
      exampleStatus('bsc', State.Normal, State.Normal),
      exampleStatus('energyweb', State.Normal, State.Normal),
      exampleStatus('moonriver', State.Normal, State.Normal)
    ])
    assert(notificationResponse.length === 0, '1 wrong notifications')
  })

  it('Selects down apps when everything is down on one network', async () => {
    const notificationResponse = await notification([
      exampleStatus('moonriver', State.Outage, State.Outage)
    ])

    assert(notificationResponse.length === 6, '2 wrong notifications')
  })

  it('Selects down apps when half is down on one network', async () => {
    const notificationResponse = await notification([
      exampleStatus('moonriver', State.Normal, State.Outage)
    ])

    assert(notificationResponse.length === 2, '3 wrong notifications')
  })

  it('Selects down apps when half is down on all networks', async () => {
    const notificationResponse = await notification([
      exampleStatus('mainnet', State.Normal, State.Outage),
      exampleStatus('polygon', State.Outage, State.Degraded),
      exampleStatus('bsc', State.Normal, State.Outage),
      exampleStatus('energyweb', State.Outage, State.Degraded),
      exampleStatus('moonriver', State.Normal, State.Outage)
    ])

    assert(notificationResponse.length === 14, 'wrong notifications')
  })

  it('Selects only down apps for notification email for multiple networks', async () => {
    const notificationResponse = await notification([
      exampleStatus('mainnet', State.Outage, State.Outage),
      exampleStatus('polygon', State.Outage, State.Outage),
      exampleStatus('bsc', State.Outage, State.Outage),
      exampleStatus('energyweb', State.Outage, State.Outage),
      exampleStatus('moonriver', State.Outage, State.Outage)
    ])
    assert(notificationResponse.length === 30, 'wrong notifications')
  })

  it('Sends notification email when one app is down', async () => {
    const downApps: ISummary[] = [
      { name: 'market', status: State.Outage, network: 'polygon' }
    ]
    const mailResp = await mail(downApps, true)
    assert(mailResp === 'message sent', 'mail not sent - mainnet')
  })

  it('Sends notification email when multiple apps are down', async () => {
    const downApps: ISummary[] = [
      { name: 'market', status: State.Outage, network: 'mainnet' },
      { name: 'provider', status: State.Outage, network: 'polygon' },
      { name: 'aquarius', status: State.Outage, network: 'energyweb' },
      { name: 'subgraph', status: State.Outage, network: 'moonriver' },
      { name: 'Operator Service', status: State.Outage, network: 'mumbai' }
    ]
    const mailResp = await mail(downApps, true)
    assert(mailResp === 'message sent', 'mail not sent - mainnet')
  })

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
