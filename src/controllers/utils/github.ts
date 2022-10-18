import { Octokit } from 'octokit'

export default async function latestRelease(repo: string) {
  try {
    const octokit = new Octokit({
      auth: `${process.env.API_TOKEN_GITHUB}`
    })

    const response = await octokit.request(
      `GET /repos/oceanprotocol/${repo}/releases`
    )
    console.log(
      `Github request remaining ${response.headers['x-ratelimit-remaining']}`
    )
    const version = response.data[0].name
      .replace(' ', '')
      .replace('v', '')
      .replace('Release', '')

    return version
  } catch (error) {
    console.log('error', error)
  }
}
