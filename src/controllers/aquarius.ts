import fetch from 'cross-fetch'

export default async function aquariusStatus(): Promise<
  'UP' | 'DOWN' | 'WARNING'
> {
  const response = await fetch('https://v4.aquarius.oceanprotocol.com/')
  // const info = await response.json()

  // const version = await fetch('https://github.com/oceanprotocol/aquarius.git')
  // const versionJson = await version.json()
  // console.log('aquariusStatus response', info)
  // console.log('aquariusStatus version', versionJson)
  console.log('Aqua response.status', response.status)
  if (response.status === 200) return 'UP'
  else return 'DOWN'
}
