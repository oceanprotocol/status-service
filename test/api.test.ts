import request from 'supertest'
import { assert } from 'chai'
import app from '../src/app'
import { dbRow } from '../src/@types'

describe('Price Request Tests', function () {
  this.timeout(240000)

  it('Gets the current status of Ocean services on Mainnet', async () => {
    const response = await request(app)
      .get('/mainnet')
      .expect('Content-Type', /json/)
      .expect(200)
    const row: dbRow = response.body

    console.log('Mainnet row', row)

    assert(response.body)
  })

  it('Gets the current status of Ocean services on Polygon', async () => {
    const response = await request(app)
      .get('/polygon')
      .expect('Content-Type', /json/)
      .expect(200)

    const row: dbRow = response.body

    console.log('Mainnet row', row)
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
