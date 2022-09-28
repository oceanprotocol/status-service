import { ethers } from 'ethers'
import { Network } from '../../@types'

export default function getWeb3Provider(
  network: Network
): ethers.providers.Provider {
  if (!network.name || !network.rpcUrl) return
  if (network.name === 'polygon') network.name = 'matic'
  if (network.name === 'mumbai') network.name = 'maticmum'

  const provider: ethers.providers.JsonRpcProvider =
    new ethers.providers.JsonRpcProvider(network.rpcUrl)
  return provider
}

export async function getBlock(network: Network): Promise<number> {
  console.log('GET web3Provider for network:', network.name)
  if (!network.rpcUrl) return 0
  const web3Provider = getWeb3Provider(network)
  const blockNum = await web3Provider.getBlockNumber()
  console.log('blockNum', blockNum)
  return blockNum
}
