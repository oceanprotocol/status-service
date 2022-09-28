import { BigNumber } from 'ethers'

export enum State {
  Up = 'UP',
  Down = 'DOWN',
  Warning = 'WARNING'
}

export interface Status {
  network: string
  currentBlock: number
  market: State
  port: State
  faucet: FaucetStatus | Record<string, never>
  aquarius: AquariusStatus
  provider: ProviderStatus
  subgraph: SubgraphStatus
  operator: OperatorStatus
  dataFarming: State
  daoGrants: State
  lastUpdatedOn: number
}
export interface ProviderStatus {
  status?: State
  response?: number
  version?: string
  latestRelease?: string
  block?: number
  latestBlock?: number
}

export interface AquariusStatus {
  status?: State
  response?: number
  chain?: boolean
  version?: string
  latestRelease?: string
  block?: number
  validQuery?: boolean
}
export interface SubgraphStatus {
  status?: State
  response?: number
  version?: string
  latestRelease?: string
  block?: number
}

export interface OperatorStatus {
  status?: State
  response?: number
  version?: string
  latestRelease?: string
  environments?: number
  limitReached?: boolean
}
export interface FaucetStatus {
  status?: State
  response?: number
  ethBalance?: BigNumber
  ethBalanceSufficient?: boolean
  oceanBalance?: BigNumber
  oceanBalanceSufficient?: boolean
}

export interface Network {
  name: string
  chainId: string
  test?: boolean
  faucetWallet?: string
  rpcUrl?: string
  oceanAddress?: string
}

export interface dbRow {
  network: string
  currentBlock: number
  aquariusStatus: State
  aquariusResponse: number
  aquariusChain: number
  aquariusVersion: string
  aquariusLatestRelease: string
  aquariusBlock: number
  aquariusValidQuery: number
  providerStatus: State
  providerResponse: number
  providerVersion: string
  providerLatestRelease: string
  subgraphStatus: State
  subgraphResponse: number
  subgraphVersion: string
  subgraphLatestRelease: string
  subgraphBlock: number
  operatorStatus: State
  operatorResponse: number
  operatorVersion: string
  operatorLatestRelease: string
  operatorEnvironments: number
  operatorLimitReached: number
  market: State
  port: State
  faucetStatus: State
  faucetResponse: number
  faucetEthBalance: BigNumber
  faucetEthBalanceSufficient: number | string
  faucetOceanBalance: BigNumber
  faucetOceanBalanceSufficient: number | string
  dataFarming: State
  daoGrants: State
  lastUpdatedOn: number
}
