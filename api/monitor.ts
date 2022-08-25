import type { VercelRequest, VercelResponse } from '@vercel/node'

export async function test() {
  try {
    console.log('test 2')
  } catch (error) {
    console.log('test 2 - ERROR')
  }
}

export default async function monitor(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    console.log('test 2')
    response.setHeader('Cache-Control', 'max-age=0, s-maxage=86400')
    response.status(200).send({ response: 'db updated successfully' })
  } catch (error) {
    response.send({ error })
  }
}
