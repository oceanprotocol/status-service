import express from 'express'
import cors from 'cors'
import cron from 'node-cron'

import indexRouter from './routes/index'
import monitor from './controllers'

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(cors())
app.use('/', indexRouter)

app.listen(port, async () => {
  console.log(`Status Service listening at http://localhost:${port}`)
})

cron.schedule(`*/${process.env.INTERVAL} * * * *`, () => {
  const networks = JSON.parse(process.env.NETWORKS)
  networks.forEach((network) => {
    console.log(`
      Monitor status for ${network.name}.
      Running task every ${process.env.INTERVAL} minutes. 
      Current time: ${Date.now()}`)

    monitor()
  })
})

export default app
