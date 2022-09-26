import { Request, Response } from 'express'
import express from 'express'
import monitor from '../controllers'
import { networkStatus } from '../controllers/db'
import { dbRow } from '../@types'

const router = express.Router()

/* GET: current status of Ocean components. */
router.get('/:network', async function (req: Request, res: Response) {
  await networkStatus(req.params.network, (row: dbRow) => {
    res.send(row)
  })
})

/* GET: monitor current status of Ocean components. */
router.get('/forceUpdate', function (req: Request, res: Response) {
  monitor(res)
})

export default router
