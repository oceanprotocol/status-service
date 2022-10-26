import Web3 from 'web3'
import { INetwork } from '../../@types'
import { AbiItem } from 'web3-utils/types'

export async function getTokenBalance(
  accountId: string,
  decimals: number,
  tokenAddress: string,
  web3: Web3
): Promise<string> {
  const minABI = [
    {
      constant: true,
      inputs: [
        {
          name: '_owner',
          type: 'address'
        }
      ],
      name: 'balanceOf',
      outputs: [
        {
          name: 'balance',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    }
  ] as AbiItem[]

  try {
    const token = new web3.eth.Contract(minABI, tokenAddress, {
      from: accountId
    })
    const balance = await token.methods.balanceOf(accountId).call()
    const adjustedDecimalsBalance = `${balance}${'0'.repeat(18 - decimals)}`
    return web3.utils.fromWei(adjustedDecimalsBalance)
  } catch (e) {
    console.log(`#: Failed to get the balance: ${e.message}`)
  }
}

export async function getBlock(network: INetwork): Promise<number> {
  if (!network.rpcUrl) return 0
  try {
    const web3Provider = new Web3(network.rpcUrl)
    const blockNum = await web3Provider.eth.getBlockNumber()
    return blockNum
  } catch (error) {
    const response = String(error)
    console.log(`# failed to get block for ${network.name} : ${response}`)
  }
  return 0
}
