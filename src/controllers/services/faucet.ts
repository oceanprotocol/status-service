import { ethers } from 'ethers'
import fetch from 'cross-fetch'
import { IComponentStatus, INetwork, State } from '../../@types'
import getWeb3Provider from '../utils/ethers'
import abi from '../../abi/token.json'

export default async function faucetStatus(
  network: INetwork
): Promise<IComponentStatus> {
  const status: IComponentStatus = {
    name: 'faucet',
    status: State.Down,
    response: 500
  }
  try {
    const web3Provider = getWeb3Provider(network)

    // Check Faucet ETH Balance for gas

    status.ethBalance = ethers.utils.formatUnits(
      await (await web3Provider.getBalance(network.faucetWallet)).toString(),
      18
    )

    const minEth = process.env.MIN_FAUCET_ETH
      ? new Number(process.env.MIN_FAUCET_ETH)
      : new Number('100')

    if (minEth > Number(status.ethBalance)) {
      status.ethBalanceSufficient = false
    } else status.ethBalanceSufficient = true

    // Check Faucet OCEAN Balance
    const contract = new ethers.Contract(
      network.oceanAddress,
      abi,
      web3Provider
    )
    status.oceanBalance = ethers.utils.formatUnits(
      await contract.balanceOf(network.faucetWallet),
      18
    )

    const minOcean = process.env.MIN_FAUCET_OCEAN
      ? new Number(process.env.MIN_FAUCET_OCEAN)
      : new Number('100')

    if (minOcean > Number(status.oceanBalance)) {
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
    status.statusMessages = []
    if (!status.ethBalanceSufficient)
      status.statusMessages.push(`Insufficient eth`)
    if (!status.ethBalanceSufficient)
      status.statusMessages.push(`Insufficient ocean`)
  } catch (error) {
    const response = String(error)
    console.log(`faucetStatus error for ${network.name}: ${response} `)
  }
  return status
}
