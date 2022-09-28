import { ethers, BigNumber } from 'ethers'
import fetch from 'cross-fetch'
import { FaucetStatus, Network, State } from '../../@types'
import getWeb3Provider from '../utils/ethers'
import abi from '../../abi/token.json'

export default async function faucetStatus(
  network: Network
): Promise<FaucetStatus> {
  const status: FaucetStatus = {}

  if (network.name === 'mumbai') network.name = 'maticmum'
  const web3Provider = getWeb3Provider(network)

  // Check Faucet ETH Balance for gas
  status.ethBalance = await web3Provider.getBalance(network.faucetWallet)
  const minEth = BigNumber.from(process.env.MIN_FAUCET_ETH)

  if (minEth.gt(status.ethBalance)) {
    status.ethBalanceSufficient = false
  } else status.ethBalanceSufficient = true

  // Check Faucet OCEAN Balance
  const contract = new ethers.Contract(network.oceanAddress, abi, web3Provider)
  status.oceanBalance = await contract.balanceOf(network.faucetWallet)
  const minOcean = BigNumber.from(process.env.MIN_FAUCET_OCEAN)

  if (minOcean.gt(status.oceanBalance)) {
    status.oceanBalanceSufficient = false
  } else status.oceanBalanceSufficient = true

  // Check that faucet is responding with 200
  status.response = (
    await fetch(`https://faucet.${network.name}.oceanprotocol.com/`)
  ).status

  if (
    status.response === 200 &&
    status.ethBalanceSufficient &&
    status.oceanBalanceSufficient
  )
    status.status = State.Up
  else status.status = State.Down

  return status
}
