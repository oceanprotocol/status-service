import express from 'express'
import cors from 'cors'

import indexRouter from './routes/index'
import { connection } from './controllers/db'

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())
app.use('/', indexRouter)

app.listen(port, async () => {
  await connection()
  console.log(`Price Request App listening at http://localhost:${port}`)
})

export default app
