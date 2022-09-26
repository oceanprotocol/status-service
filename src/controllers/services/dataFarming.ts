import fetch from 'cross-fetch'

export default async function dfStatus(): Promise<'UP' | 'DOWN'> {
  try {
    const response = await fetch('https://df.oceandao.org/rewards')
    if (response.status === 200) return 'UP'
    else return 'DOWN'
  } catch (error) {
    console.log(error)
  }
}
