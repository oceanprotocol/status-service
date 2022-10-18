export enum State {
  Up = 'UP',
  Down = 'DOWN',
  Warning = 'WARNING'
}

export interface IStatus {
  network: string
  currentBlock: number
  market: State
  faucet: IFaucetStatus | Record<string, never>
  aquarius: IAquariusStatus
  provider: IProviderStatus
  subgraph: ISubgraphStatus
  operator: IOperatorStatus
  dataFarming: State
  lastUpdatedOn: number
}
export interface IProviderStatus {
  status?: State
  statusMessages?: string
  response?: number
  version?: string
  latestRelease?: string
}

export interface IAquariusStatus {
  status?: State
  statusMessages?: string
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
  statusMessages?: string
  response?: number
  version?: string
  latestRelease?: string
  block?: number
}

export interface IOperatorStatus {
  status?: State
  statusMessages?: string
  response?: number
  version?: string
  latestRelease?: string
  environments?: number
  limitReached?: boolean
}
export interface IFaucetStatus {
  status?: State
  statusMessages?: string
  response?: number
  ethBalance?: string
  ethBalanceSufficient?: boolean
  oceanBalance?: string
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

export interface ISummary {
  name: string
  status: string
  network: string
}

export interface ICurrentVersions {
  providerLatestVersion: string
  aquariusLatestVersion: string
  subgraphLatestVersion: string
  operatorLatestVersion: string
}
