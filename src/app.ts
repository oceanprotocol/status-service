import express from 'express'
import cors from 'cors'
import cron from 'node-cron'

import indexRouter from './routes/index'
import monitor from './controllers'
import { connection } from './db/mongodb'

const app = express()
const port = process.env.PORT ? process.env.PORT : '8080'
const cronInterval = process.env.INTERVAL ? process.env.INTERVAL : '60'

app.use(express.json())
app.use(cors())
app.use('/', indexRouter)

app.listen(port, async () => {
  await connection()
  console.log(`Status Service listening at http://localhost:${port}`)
})

cron.schedule(`*/${cronInterval} * * * *`, () => {
  const networks = JSON.parse(process.env.NETWORKS)
  networks.forEach((network) => {
    console.log(`
      Monitor status for ${network.name}.
      Running task every ${cronInterval} minutes. 
      Current time: ${Date.now()}`)

    monitor()
  })
})

export default app
