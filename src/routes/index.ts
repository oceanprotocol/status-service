import { Request, Response } from 'express'
import express from 'express'
import monitor from '../controllers'
import { networkStatus } from '../controllers/db'

const router = express.Router()

/* GET: current status of Ocean components. */
router.get('/:network', async function (req: Request, res: Response) {
  const response = await networkStatus(req.params.network)
  console.log(Date.now())
  console.log('response: ', response)
  res.send({ response })
})

/* GET: monitor current status of Ocean components. */
router.get('/', function (req: Request, res: Response) {
  monitor(res)
})

export default router
