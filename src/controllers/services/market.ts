import fetch from 'cross-fetch'
import { State } from '../../@types'

export default async function marketStatus(): Promise<State> {
  try {
    const response = await fetch('https://market.oceanprotocol.com/')
    if (response.status === 200) return State.Up
    else return State.Down
  } catch (error) {
    console.log(error)
  }
}
