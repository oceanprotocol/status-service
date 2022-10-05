import fetch from 'cross-fetch'
import { State } from '../../@types'

export default async function dfStatus(): Promise<State> {
  try {
    const response = await fetch('https://df.oceandao.org/rewards')
    if (response.status === 200) return State.Up
    else return State.Down
  } catch (error) {
    console.log(error)
  }
}
