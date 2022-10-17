import { Request, Response } from 'express'
import express from 'express'
import monitor from '../controllers'

const router = express.Router()

/* GET: trigger the monitoring of all Ocean components. */
router.get('/forceUpdate', async function (req: Request, res: Response) {
  try {
    const test: boolean = req.query.test === 'true' ? true : false
    const response = await monitor(test)
    res.send({ response })
  } catch (error) {
    console.log(error)
    res.send({ error })
  }
})

export default router
