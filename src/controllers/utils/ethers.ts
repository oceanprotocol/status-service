import { ethers } from 'ethers'
import { INetwork } from '../../@types'

export default function getWeb3Provider(
  network: INetwork
): ethers.providers.Provider {
  if (!network.name || !network.rpcUrl) return

  const provider: ethers.providers.JsonRpcProvider =
    new ethers.providers.JsonRpcProvider(network.rpcUrl)
  return provider
}

export async function getBlock(network: INetwork): Promise<number> {
  if (!network.rpcUrl) return 0
  const web3Provider = getWeb3Provider(network)
  const blockNum = await web3Provider.getBlockNumber()
  return blockNum
}
