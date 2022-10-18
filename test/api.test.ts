import request from 'supertest'
import { assert } from 'chai'
import app from '../src/app'
import monitor from '../src/controllers'
import mail from '../src/controllers/mail'
import notification from '../src/controllers/notification'
import { IStatus, ISummary, State } from '../src/@types'
import { insertMany } from '../src/db/mongodb'

describe('Price Request Tests', function () {
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
      market: state1,
      dataFarming: state1,
      faucet: {},
      provider: {
        response: 200,
        version: '1.0.20',
        latestRelease: '1.3.4',
        status: state1
      },
      subgraph: {
        block: recentBlock,
        version: '2.1.3',
        latestRelease: '2.1.3',
        response: 200,
        status: state2
      },
      aquarius: {
        response: 200,
        version: '4.4.2',
        latestRelease: '4.5.1',
        validChainList: true,
        block: recentBlock,
        monitorVersion: '4.5.1',
        validQuery: true,
        status: state1
      },
      operator: {
        limitReached: false,
        response: 200,
        version: '1.0.1',
        latestRelease: '1.0.1',
        environments: 2,
        status: state2
      },
      lastUpdatedOn: date
    }
    return status
  }

  it('Selects no down apps when nothing is down', async () => {
    const notificationResponse = await notification([
      exampleStatus('mainnet', State.Up, State.Up),
      exampleStatus('polygon', State.Up, State.Up),
      exampleStatus('bsc', State.Up, State.Up),
      exampleStatus('energyweb', State.Up, State.Up),
      exampleStatus('moonriver', State.Up, State.Up)
    ])
    assert(notificationResponse.length === 0, '1 wrong notifications')
  })

  it('Selects down apps when everything is down on one network', async () => {
    const notificationResponse = await notification([
      exampleStatus('moonriver', State.Down, State.Down)
    ])

    assert(notificationResponse.length === 6, '2 wrong notifications')
  })

  it('Selects down apps when half is down on one network', async () => {
    const notificationResponse = await notification([
      exampleStatus('moonriver', State.Up, State.Down)
    ])

    assert(notificationResponse.length === 2, '3 wrong notifications')
  })

  it('Selects down apps when half is down on all networks', async () => {
    const notificationResponse = await notification([
      exampleStatus('mainnet', State.Up, State.Down),
      exampleStatus('polygon', State.Down, State.Warning),
      exampleStatus('bsc', State.Up, State.Down),
      exampleStatus('energyweb', State.Down, State.Warning),
      exampleStatus('moonriver', State.Up, State.Down)
    ])

    assert(notificationResponse.length === 14, 'wrong notifications')
  })

  it('Selects only down apps for notification email for multiple networks', async () => {
    const notificationResponse = await notification([
      exampleStatus('mainnet', State.Down, State.Down),
      exampleStatus('polygon', State.Down, State.Down),
      exampleStatus('bsc', State.Down, State.Down),
      exampleStatus('energyweb', State.Down, State.Down),
      exampleStatus('moonriver', State.Down, State.Down)
    ])
    assert(notificationResponse.length === 30, 'wrong notifications')
  })

  it('Sends notification email when one app is down', async () => {
    const downApps: ISummary[] = [
      { name: 'market', status: State.Down, network: 'polygon' }
    ]
    const mailResp = await mail(downApps, true)
    assert(mailResp === 'message sent', 'mail not sent - mainnet')
  })

  it('Sends notification email when multiple apps are down', async () => {
    const downApps: ISummary[] = [
      { name: 'market', status: State.Down, network: 'mainnet' },
      { name: 'provider', status: State.Down, network: 'polygon' },
      { name: 'aquarius', status: State.Down, network: 'energyweb' },
      { name: 'subgraph', status: State.Down, network: 'moonriver' },
      { name: 'Operator Service', status: State.Down, network: 'mumbai' }
    ]
    const mailResp = await mail(downApps, true)
    assert(mailResp === 'message sent', 'mail not sent - mainnet')
  })

  it('Updates database', async () => {
    const dbResponse = await insertMany([
      exampleStatus('mainnet', State.Up, State.Down),
      exampleStatus('polygon', State.Down, State.Warning),
      exampleStatus('bsc', State.Up, State.Down),
      exampleStatus('energyweb', State.Down, State.Warning),
      exampleStatus('moonriver', State.Up, State.Down)
    ])

    assert(
      dbResponse === 'status inserted into MongoDB',
      'Failed to monitor services and update DB'
    )
  })

  it('Monitors the current status of all Ocean components', async () => {
    const response = await monitor()
    assert(
      response === 'status inserted into MongoDB',
      'Failed to monitor services and update DB'
    )
  })
})
