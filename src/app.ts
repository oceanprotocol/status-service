import express from 'express'
import cors from 'cors'
import cron from 'node-cron'

import indexRouter from './routes/index'
import monitor from './controllers'

const app = express()
const port = process.env.PORT ? process.env.PORT : '8080'
const cronInterval = process.env.INTERVAL ? process.env.INTERVAL : '60'

app.use(express.json())
app.use(cors())
app.use('/', indexRouter)

app.listen(port, async () => {
  console.log(`Status Service listening at http://localhost:${port}`)
  monitor()
})

cron.schedule(`*/${cronInterval} * * * *`, () => {
  monitor()
})

export default app
