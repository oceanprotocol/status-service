import { ethers } from 'ethers'
import fetch from 'cross-fetch'
import latestRelease from '../utils/github'
import { ProviderStatus } from '../../@types'

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
    case 'bsc':
      return {
        did: '8f42a3abe49da60474b0e89dd95608d9bbce1d42810469a38d2272efda6783f7',
        serviceId:
          '4cea128568e3a72c79efd6cdda10f0892a64c2ece6414d7cfa38dd58cb981555'
      }
    case 'energyweb':
      return {
        did: '77367b084ada384062c09021bcd14aced2537f708eee59990f14220e19829586',
        serviceId:
          '5fe2fdf638b71126ce7fba10ca8713cf046d0506f305f4d75747ab628cbbc73c'
      }
    case 'moonriver':
      return {
        did: 'a3aa14de333ee1ecb3b8a842954033c1c0004f9e77020cacb861843478c1079c',
        serviceId:
          'e02fda4094bb3c06bdbe1b300adb137922e77a82ab818595f6f3d3b38cc1a885'
      }
    case 'ropsten':
      return {
        did: '575ac17378b37f678ff7d1e67aa7d0cd78f3d5618a28822efa244cb1ae009a7c',
        serviceId:
          '921b5fc518651a8fe192c3cff4456656dde88a8541de45016c630dab52142e65'
      }
    case 'rinkeby':
      return {
        did: '6d2e99a4d4d501b6ebc0c60d0d6899305c4e8ecbc7293c132841e8d46832bd89',
        serviceId: '0'
      }
    case 'mumbai':
      return {
        did: '3258e62ced6bf8da9390cb132bdf31a4ca9b4474c40c5e3c898e70b85eb81a35',
        serviceId:
          'ac7ff0c2db9f76465874e01b9490c8cb7a854ba7935c4a7bdde3550e4cefca9d'
      }
    case 'moonbase':
      return {
        did: '3b91a15fef9c47ef76274be9cfc8af7f24055577cf2ecb8e28bc7ee465802781',
        serviceId:
          '2bb9c8cadd3ebf850a0d80b8b086de2a6c50b5e43971d7e25ad387d1350500e5'
      }

    default:
      break
  }
  return
}

async function providerRequest(network: string, path: string, body: string) {
  const response = await fetch(
    `https://v4.provider.${network}.oceanprotocol.com/api/services/${path}`,
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
  network: string
): Promise<ProviderStatus> {
  const providerStatus: ProviderStatus = {}
  const response = await fetch(
    `https://v4.provider.${network}.oceanprotocol.com/`
  )
  providerStatus.version = (await response.json()).version
  const release = await latestRelease('provider')

  const fileInfo = (await providerRequest(network, 'fileinfo', fileInfoBody))[0]
  const initialize = await fetch(
    `https://v4.provider.${network}.oceanprotocol.com/api/services/initialize?documentId=did:op:${
      initializeInfo(network).did
    }&serviceId=${
      initializeInfo(network).serviceId
    }&fileIndex=0&consumerAddress=0x0000000000000000000000000000000000000000`
  )
  const initializeResponse = await initialize.json()
  const validDt = ethers.utils.isAddress(initializeResponse.datatoken)

  if (response.status !== 200 && !fileInfo.valid && !validDt)
    providerStatus.status = 'DOWN'
  else if (providerStatus.version !== release) providerStatus.status = 'WARNING'
  else providerStatus.status = 'UP'

  return providerStatus
}
