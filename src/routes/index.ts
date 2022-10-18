import { Request, Response } from 'express'
import express from 'express'
import monitor from '../controllers'

const router = express.Router()

/* GET: trigger the monitoring of all Ocean components. */
router.get('/forceUpdate', async function (req: Request, res: Response) {
  try {
    const response = await monitor()
    res.send({ response })
  } catch (error) {
    console.log(error)
    res.send({ error })
  }
})

router.get('/', async function (req: Request, res: Response) {
  // this is needed for kubernetes live probe
  res.send('All good')
})

export default router
