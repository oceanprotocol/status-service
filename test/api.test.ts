import request from 'supertest'
import { assert } from 'chai'
import app from '../src/app'
import mail from '../src/controllers/mail'

describe('Price Request Tests', function () {
  this.timeout(300000)

  it('Sends notification email - mainnet', async () => {
    const mailResp = await mail(['market', 'provider', 'port'], 'mainnet', true)
    assert(mailResp === 'message sent', 'mail not sent - mainnet')
  })

  it('Sends notification email - polygon', async () => {
    const mailResp = await mail(['aquarius'], 'polygon', true)
    assert(mailResp === 'message sent', 'mail not sent - polygon')
  })

  // it('Monitors the current status of all Ocean components', async () => {
  //   const response = await request(app).get('/forceUpdate').expect(200)
  //   console.log('response', response.body.response)
  //   assert(
  //     response.body.response === 'Database has been updated',
  //     'Failed to monitor services and update DB'
  //   )
  // })
})
