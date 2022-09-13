import { ethers } from 'ethers'
import { Network } from '../../@types'

export default function getWeb3Provider(
  network: Network
): ethers.providers.Provider {
  if (!network.name || !network.infuraId) return
  if (network.name === 'polygon') network.name = 'matic'
  if (network.name === 'mumbai') network.name = 'maticmum'

  const provider = new ethers.providers.InfuraProvider(
    network.name,
    network.infuraId
  )
  return provider
}
