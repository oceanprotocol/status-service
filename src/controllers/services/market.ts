import fetch from 'cross-fetch'

export default async function marketStatus(): Promise<'UP' | 'DOWN'> {
  try {
    const response = await fetch('https://market.oceanprotocol.com/')
    if (response.status === 200) return 'UP'
    else return 'DOWN'
  } catch (error) {
    console.log(error)
  }
}
