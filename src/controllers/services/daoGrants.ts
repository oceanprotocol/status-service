import fetch from 'cross-fetch'

export default async function grantsStatus(): Promise<'UP' | 'DOWN'> {
  try {
    const response = await fetch('https://seed.oceandao.org/')
    if (response.status === 200) return 'UP'
    else return 'DOWN'
  } catch (error) {
    console.log(error)
  }
}
