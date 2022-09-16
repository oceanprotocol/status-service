import request from 'supertest'
import { assert } from 'chai'
import app from '../src/app'

describe('Price Request Tests', function () {
  this.timeout(60000)

  it('Starts the server', async () => {
    request(app).get('/').expect('Content-Type', /json/).expect(200)
  })

  it('Monitors the current status of OCEAN', async () => {
    const response = await request(app)
      .get('/monitor')
      .expect('Content-Type', /json/)
      .expect(200)

    assert(
      response.body.response === 'Database has been updated',
      'Failed to monitor services and update DB'
    )
  })

  it('Gets the current status of Ocean services', async () => {
    const response = await request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200)

    assert(response.body)
  })
})
