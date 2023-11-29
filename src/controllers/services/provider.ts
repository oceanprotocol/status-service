import fetch from 'cross-fetch'
import Web3 from 'web3'
import { IComponentStatus, State } from '../../@types'
import { getVersionMissmatchError } from '../utils/messages'

const fileInfoBody = `{
  "url": "https://s3.amazonaws.com/testfiles.oceanprotocol.com/info.0.json",
  "type": "url",
  "method": "GET"
}`

function initializeInfo(network: string): { did: string; serviceId: string } {
  switch (network) {
    case 'mainnet':
      return {
        did: 'cec63ed9e9d9eb313bc6cef25a4e40ca05091efb8694e290fa8a35d58883deaf',
        serviceId:
          '8c518f366639916dd6a5edc9f83524d5bb5a8768bd179b9386981838568e7f79'
      }
    case 'polygon':
      return {
        did: '39b9fa755de838a1a912e8589f64ce1601157cc2f1418ee9a3e77b7c7342f986',
        serviceId: '0'
      }
    case 'optimism':
      return {
        did: '4cbd07b80dcaeef355411e84cf98842b186c07fad3e5e329c3de6b131847789b',
        serviceId:
          '12cb29e8d9a2d947ee8e592d0a000181862119dc3e13a2e59ac68e3d92ddca24'
      }
    case 'mumbai':
      return {
        did: '3258e62ced6bf8da9390cb132bdf31a4ca9b4474c40c5e3c898e70b85eb81a35',
        serviceId:
          'ac7ff0c2db9f76465874e01b9490c8cb7a854ba7935c4a7bdde3550e4cefca9d'
      }
    case 'sepolia':
      return {
        did: '76eb60fad9984291c071d8e8ecb9bc0c4c2b5d46418d67947be620731c17bdbb',
        serviceId:
          '2124c26a31571df36e23469b47ace68393ad2d8116427318526321c6bb5d0e25'
      }

    default:
      break
  }
  return
}

async function providerRequest(path: string, body: string) {
  const response = await fetch(
    `https://v4.provider.oceanprotocol.com/api/services/${path}`,
    {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body
    }
  )
  const data = await response.json()
  return data
}

export default async function providerStatus(
  network: string,
  latestRelease: string
): Promise<IComponentStatus> {
  const status: IComponentStatus = {
    name: 'provider',
    status: State.Outage,
    response: 500,
    url: `https://v4.provider.oceanprotocol.com/`
  }

  try {
    const response = await fetch(`https://v4.provider.oceanprotocol.com/`)
    status.response = response.status
    status.version = (await response.json()).version
    status.latestRelease = latestRelease

    const initInfo = initializeInfo(network)
    console.log(network, initInfo)

    const fileInfo = (await providerRequest('fileinfo', fileInfoBody))[0]
    const endpoint = `https://v4.provider.oceanprotocol.com/api/services/initialize?documentId=did:op:${initInfo.did}&serviceId=${initInfo.serviceId}&fileIndex=0&consumerAddress=0x0000000000000000000000000000000000000000`
    const initialize = await fetch(endpoint)
    console.log(network, endpoint)

    const initializeResponse = await initialize.json()
    const validDt = Web3.utils.isAddress(initializeResponse.datatoken)

    if (response.status !== 200 && !fileInfo.valid && !validDt) {
      status.status = State.Outage
      status.error =
        response.statusText +
        ' && file info :' +
        fileInfo.valid +
        ' && validDt: ' +
        validDt
    } else status.status = State.Normal

    status.statusMessages = []
    if (status.version !== status.latestRelease)
      status.statusMessages.push(
        getVersionMissmatchError(status.version, status.latestRelease)
      )
    if (!fileInfo.valid)
      status.statusMessages.push(`Initialize info endpoint failing`)
  } catch (error) {
    const response = String(error)
    console.log(`providerStatus error for ${network}: ${response} `)
    status.error = response
  }
  return status
}
