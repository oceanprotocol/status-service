import { Octokit } from 'octokit'

export default async function latestRelease(repo: string) {
  try {
    const octokit = new Octokit({
      auth: `${process.env.GITHUB_API_TOKEN}`
    })

    const response = await octokit.request(
      `GET /repos/oceanprotocol/${repo}/releases`
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
