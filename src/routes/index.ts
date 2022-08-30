import { Request, Response } from 'express'
import express from 'express'

const router = express.Router()

/* GET Current Token Price. */
router.get('/', function (req: Request, res: Response) {
  console.log(req, res)
})

/* GET Historical Token Price. */
router.get('/monitor/', function (req: Request, res: Response) {
  console.log(req, res)
})

export default router
