import request from 'supertest'
import { assert } from 'chai'
import app from '../src/app'

describe('Price Request Tests', function () {
  this.timeout(240000)

  it('Starts the server', async () => {
    request(app).get('/').expect('Content-Type', /json/).expect(200)
  })

  it('Gets the current status of Ocean services on Mainnet', async () => {
    const response = await request(app)
      .get('/mainnet')
      .expect('Content-Type', /json/)
      .expect(200)

    assert(response.body)
  })

  it('Gets the current status of Ocean services on Rinkeby', async () => {
    const response = await request(app)
      .get('/rinkeby')
      .expect('Content-Type', /json/)
      .expect(200)

    assert(response.body)
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
