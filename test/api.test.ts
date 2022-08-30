import express from 'express'
// import request from 'supertest'
// import { expect } from 'chai'

let server
const app = express()

before((done) => {
  server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}.`)
    done()
  })
})

describe('Price Request Tests', () => {
  it('Starts the server', async () => {
    // request(monitor).get('/api/monitor').expect(200).expect('Hello World!')
    console.log('TEST')
  })
})
