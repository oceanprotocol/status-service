export enum State {
  Normal = 'Normal',
  Degraded = 'Degraded',
  Outage = 'Outage'
}

export enum NotificationType {
  Eng = 'Engineering',
  DevOps = 'DevOps'
}

export interface IStatus {
  network: string
  currentBlock?: number
  components: IComponentStatus[]
  lastUpdatedOn: number
}

export interface Notification {
  type: NotificationType
  services: ISummary[]
  lastUpdatedOn: number
}

export interface IComponentStatus {
  name: string
  status: State
  response: number
  statusMessages?: string[]
  version?: string
  latestRelease?: string
  url?: string
  validChainList?: boolean
  block?: number
  validQuery?: boolean
  environments?: number
  limitReached?: boolean
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
