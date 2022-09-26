import { Request, Response } from 'express'
import express from 'express'
import monitor from '../controllers'
import { networkStatus, getStatus } from '../controllers/db'
import { dbRow } from '../@types'

const router = express.Router()

/* GET: current status of Ocean components on all networks. */
router.get('/', async function (req: Request, res: Response) {
  await getStatus((rows: dbRow[]) => {
    res.send(rows)
  })
})

/* GET: current status of Ocean components on a given network. */
router.get('/:network', async function (req: Request, res: Response) {
  await networkStatus(req.params.network, (row: dbRow) => {
    res.send(row)
  })
})

/* GET: trigger the monitoring of all Ocean components. */
router.get('/forceUpdate', function (req: Request, res: Response) {
  monitor(res)
})

export default router
