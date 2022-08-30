import express from 'express'
import cors from 'cors'

const app = express()
const port = 3000

import indexRouter from './routes/index'

app.use(express.json())
app.use(cors())
app.use('/', indexRouter)

app.listen(port, () => {
  console.log(`Price Request App listening at http://localhost:${port}`)
})

export default app
