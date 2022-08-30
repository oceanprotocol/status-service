import { Request, Response } from 'express'
import express from 'express'
import monitor from '../controllers/monitor'

const router = express.Router()

/* GET: current status of Ocean components. */
router.get('/', function (req: Request, res: Response) {
  console.log(req.query)
  const test = '123'
  res.send({ test })
})

/* GET: monitor current status of Ocean components. */
router.get('/monitor/', function (req: Request, res: Response) {
  monitor(req, res)
})

export default router
