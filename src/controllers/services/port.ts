import fetch from 'cross-fetch'
import { State } from '../../@types'

export default async function portStatus(): Promise<State> {
  try {
    const response = await fetch('https://port.oceanprotocol.com/')
    if (response.status === 200) return State.Up
    else return State.Down
  } catch (error) {
    console.log(error)
  }
}
