import { Request, Response } from 'express'
import express from 'express'
import monitor from '../controllers'
import { networkStatus, getStatus } from '../controllers/db'
import { Status } from '../@types'

const router = express.Router()

/* GET: current status of Ocean components on all networks. */
router.get('/', async function (req: Request, res: Response) {
  console.log('Start 123')
  await getStatus((rows: Status[]) => {
    res.send(rows)
  })
})

/* GET: current status of Ocean components on a given network. */
router.get('/network/:network', async function (req: Request, res: Response) {
  await networkStatus(req.params.network, (row: Status) => {
    res.send(row)
  })
})

/* GET: trigger the monitoring of all Ocean components. */
router.get('/forceUpdate', async function (req: Request, res: Response) {
  const response = await monitor()
  console.log('Response before sending: ', response)
  res.send({ response })
})

export default router
