import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import fetch from 'cross-fetch'
import { IFaucetStatus, INetwork, State } from '../../@types'
import getWeb3Provider from '../utils/ethers'
import abi from '../../abi/token.json'

export default async function faucetStatus(
  network: INetwork
): Promise<IFaucetStatus> {
  const status: IFaucetStatus = {}

  const web3Provider = getWeb3Provider(network)

  // Check Faucet ETH Balance for gas
  status.ethBalance = await web3Provider
    .getBalance(network.faucetWallet)
    .toString()
  const minEth = process.env.MIN_FAUCET_ETH
    ? new BigNumber(process.env.MIN_FAUCET_ETH)
    : new BigNumber('100')

  if (minEth.gt(status.ethBalance)) {
    status.ethBalanceSufficient = false
  } else status.ethBalanceSufficient = true

  // Check Faucet OCEAN Balance
  const contract = new ethers.Contract(network.oceanAddress, abi, web3Provider)
  status.oceanBalance = await contract.balanceOf(network.faucetWallet)

  const minOcean = process.env.MIN_FAUCET_OCEAN
    ? new BigNumber(process.env.MIN_FAUCET_OCEAN)
    : new BigNumber('100')

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
  const statusMessages = []
  if (!status.ethBalanceSufficient) statusMessages.push(`Insufficient eth`)
  if (!status.ethBalanceSufficient) statusMessages.push(`Insufficient ocean`)

  status.statusMessages = statusMessages.toString()
  return status
}
