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
    status: State.Outage,
    response: 500,
    url: `https://faucet.${network.name}.oceanprotocol.com/`
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

    if (status.response === 200) status.status = State.Normal
    else status.status = State.Outage
    status.statusMessages = []

    if (Number(status.oceanBalance) < 1000) {
      status.status = State.Outage
      status.statusMessages.push(
        `Insufficient OCEAN. Available ${status.oceanBalance}`
      )
    } else if (!status.oceanBalanceSufficient)
      status.statusMessages.push(
        `Low on OCEAN. Available ${status.oceanBalance}`
      )

    if (Number(status.ethBalance) < 0.3) {
      status.status = State.Outage
      status.statusMessages.push(
        `Insufficient network tokens. Available ${status.ethBalance}`
      )
    } else if (!status.ethBalanceSufficient)
      status.statusMessages.push(
        `Low on network tokens. Available ${status.ethBalance}`
      )
  } catch (error) {
    const response = String(error)
    console.log(`faucetStatus error for ${network.name}: ${response} `)
  }
  return status
}
