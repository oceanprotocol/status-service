import request from 'supertest'
import { assert } from 'chai'
import app from '../src/app'
import monitor from '../src/controllers'
import mail from '../src/controllers/mail'
import notification from '../src/controllers/notification'
import { IStatus, State } from '../src/@types'

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
      port: state2,
      dataFarming: state1,
      daoGrants: state2,
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

  it('Selects only down apps for notification email - mainnet', async () => {
    const notificationResponse = await notification(
      exampleStatus('mainnet', State.Up, State.Up),
      'mainnet'
    )
    assert(notificationResponse.length === 0, 'wrong notifications - mainnet')
  })

  it('Selects only down apps for notification email - polygon', async () => {
    const notificationResponse = await notification(
      exampleStatus('mainnet', State.Warning, State.Up),
      'polygon'
    )
    assert(notificationResponse.length === 0, 'wrong notifications - polygon')
  })

  it('Selects only down apps for notification email - bsc', async () => {
    const notificationResponse = await notification(
      exampleStatus('bsc', State.Down, State.Warning),
      'bsc'
    )
    assert(notificationResponse.length === 4, 'wrong notifications - bsc')
  })

  it('Selects only down apps for notification email - energyweb', async () => {
    const notificationResponse = await notification(
      exampleStatus('energyweb', State.Warning, State.Down),
      'energyweb'
    )
    assert(notificationResponse.length === 4, 'wrong notifications - energyweb')
  })

  it('Selects only down apps for notification email - moonriver', async () => {
    const notificationResponse = await notification(
      exampleStatus('moonriver', State.Down, State.Down),
      'moonriver'
    )
    assert(notificationResponse.length === 8, 'wrong notifications - moonriver')
  })

  it('Sends notification email - mainnet', async () => {
    const mailResp = await mail(['market', 'provider', 'port'], 'mainnet', true)
    assert(mailResp === 'message sent', 'mail not sent - mainnet')
  })

  it('Sends notification email - polygon', async () => {
    const mailResp = await mail(['aquarius'], 'polygon', true)
    assert(mailResp === 'message sent', 'mail not sent - polygon')
  })

  it('Monitors the current status of all Ocean components', async () => {
    const test = true
    const response = await monitor(test)
    assert(
      response === 'Database has been updated',
      'Failed to monitor services and update DB'
    )
  })

  it('Force update the current status of all Ocean components', async () => {
    const response = await request(app)
      .get('/forceUpdate?test=true')
      .expect(200)
    console.log('response', response.body.response)
    assert(
      response.body.response === 'Database has been updated',
      'Failed to monitor services and update DB'
    )
  })
})
