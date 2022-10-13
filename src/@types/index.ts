import { BigNumber } from 'ethers'

export enum State {
  Up = 'UP',
  Down = 'DOWN',
  Warning = 'WARNING'
}

export interface IStatus {
  network: string
  currentBlock: number
  market: State
  port: State
  faucet: IFaucetStatus | Record<string, never>
  aquarius: IAquariusStatus
  provider: IProviderStatus
  subgraph: ISubgraphStatus
  operator: IOperatorStatus
  dataFarming: State
  daoGrants: State
  lastUpdatedOn: number
}
export interface IProviderStatus {
  status?: State
  response?: number
  version?: string
  latestRelease?: string
}

export interface IAquariusStatus {
  status?: State
  response?: number
  validChainList?: boolean
  version?: string
  monitorVersion?: string
  latestRelease?: string
  block?: number
  validQuery?: boolean
}
export interface ISubgraphStatus {
  status?: State
  response?: number
  version?: string
  latestRelease?: string
  block?: number
}

export interface IOperatorStatus {
  status?: State
  response?: number
  version?: string
  latestRelease?: string
  environments?: number
  limitReached?: boolean
}
export interface IFaucetStatus {
  status?: State
  response?: number
  ethBalance?: BigNumber
  ethBalanceSufficient?: boolean
  oceanBalance?: BigNumber
  oceanBalanceSufficient?: boolean
}

export interface INetwork {
  name: string
  chainId: string
  test?: boolean
  faucetWallet?: string
  rpcUrl?: string
  oceanAddress?: string
}
