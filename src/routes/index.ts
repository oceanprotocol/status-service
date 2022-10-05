import { Request, Response } from 'express'
import express from 'express'
import monitor from '../controllers'

const router = express.Router()

/* GET: trigger the monitoring of all Ocean components. */
router.get('/forceUpdate', async function (req: Request, res: Response) {
  const response = await monitor()
  console.log('Response before sending: ', response)
  res.send({ response })
})

export default router
