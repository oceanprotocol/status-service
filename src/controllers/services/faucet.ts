import { ethers, BigNumber } from 'ethers'
import fetch from 'cross-fetch'
import { FaucetStatus } from '../../@types'
import abi from '../../abi/token.json'

async function getOceanBalance(address: string) {
  try {
    const tokenInstance = new web3.eth.Contract(
      abi,
      process.env.TOKEN_CONTRACT_ADDRESS
    )
    const ballanceOcean = await tokenInstance.methods
      .balanceOf(String(address))
      .call()
    return ballanceOcean
  } catch (error) {
    console.log('Error 1', error)
  }
}

export default async function faucetStatus(
  network: string,
  address: string,
  infuraId: string
): Promise<FaucetStatus> {
  const status: FaucetStatus = {}

  if (network === 'mumbai') network = 'maticmum'
  const provider = new ethers.providers.InfuraProvider(network, infuraId)
  status.ethBalance = await provider.getBalance(address)
  const minEth = BigNumber.from(process.env.MIN_FAUCET_ETH)

  if (minEth.gt(status.ethBalance)) {
    status.ethBalanceSufficient = false
  } else status.ethBalanceSufficient = true

  const response = await fetch(`https://faucet.${network}.oceanprotocol.com/`)
  if (response.status === 200) status.status = 'UP'
  else status.status = 'DOWN'

  return status
}
