import { ethers, BigNumber } from 'ethers'
import fetch from 'cross-fetch'
import { FaucetStatus } from '../../@types'
import abi from '../../abi/token.json'

export default async function faucetStatus(
  network: string,
  faucetAddress: string,
  infuraId: string,
  oceanAddress: string
): Promise<FaucetStatus> {
  const status: FaucetStatus = {}

  if (network === 'mumbai') network = 'maticmum'
  const provider = new ethers.providers.InfuraProvider(network, infuraId)

  // Check Faucet ETH Balance for gas
  status.ethBalance = await provider.getBalance(faucetAddress)
  const minEth = BigNumber.from(process.env.MIN_FAUCET_ETH)

  if (minEth.gt(status.ethBalance)) {
    status.ethBalanceSufficient = false
  } else status.ethBalanceSufficient = true

  // Check Faucet OCEAN Balance
  const contract = new ethers.Contract(oceanAddress, abi, provider)
  status.oceanBalance = await contract.balanceOf(faucetAddress)
  const minOcean = BigNumber.from(process.env.MIN_FAUCET_OCEAN)

  if (minOcean.gt(status.oceanBalance)) {
    status.oceanBalanceSufficient = false
  } else status.oceanBalanceSufficient = true

  // Check that faucet is responding with 200
  status.response = (
    await fetch(`https://faucet.${network}.oceanprotocol.com/`)
  ).status

  if (
    status.response === 200 &&
    status.ethBalanceSufficient &&
    status.oceanBalanceSufficient
  )
    status.status = 'UP'
  else status.status = 'DOWN'

  return status
}
