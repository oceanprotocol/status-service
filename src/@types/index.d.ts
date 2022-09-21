import { BigNumber } from 'ethers'

export interface Status {
  network: string
  aquarius?: AquariusStatus
  provider?: ProviderStatus
  subgraph?: SubgraphStatus
  market?: 'UP' | 'DOWN'
  port?: 'UP' | 'DOWN'
  faucet?: FaucetStatus
  operatorService?: OperatorStatus
  dataFarming?: 'UP' | 'DOWN'
  daoGrants?: 'UP' | 'DOWN'
}
export interface ProviderStatus {
  status?: 'UP' | 'DOWN' | 'WARNING'
  response?: number
  version?: string
  latestRelease?: string
  block?: number
  latestBlock?: number
}

export interface AquariusStatus {
  status?: 'UP' | 'DOWN' | 'WARNING'
  response?: number
  chain?: boolean
  version?: string
  latestRelease?: string
  block?: number
  latestBlock?: number
  validQuery?: boolean
}
export interface SubgraphStatus {
  status?: 'UP' | 'DOWN' | 'WARNING'
  response?: number
  version?: string
  latestRelease?: string
  block?: number
  latestBlock?: number
}

export interface OperatorStatus {
  status?: 'UP' | 'DOWN' | 'WARNING'
  response?: number
  version?: string
  latestRelease?: string
  environments?: number
  limitReached?: boolean
}
export interface FaucetStatus {
  status?: 'UP' | 'DOWN' | 'WARNING' | 'N/A'
  response?: number | 'N/A'
  ethBalance?: BigNumber | 'N/A'
  ethBalanceSufficient?: boolean | 'N/A'
  oceanBalance?: BigNumber | 'N/A'
  oceanBalanceSufficient?: boolean | 'N/A'
}

export interface Network {
  name: string
  chainId: string
  test?: boolean
  faucetWallet?: string
  infuraId?: string
  oceanAddress?: string
}

export interface dbRow {
  network: string
  aquariusStatus: string
  aquariusResponse: number
  aquariusChain: number
  aquariusVersion: string
  aquariusLatestRelease: string
  aquariusBlock: number
  aquariusValidQuery: number
  providerStatus: string
  providerResponse: null
  providerVersion: string
  providerLatestRelease: string
  subgraphStatus: string
  subgraphResponse: number
  subgraphVersion: string
  subgraphLatestRelease: null
  subgraphBlock: number
  operatorStatus: string
  operatorResponse: number
  operatorVersion: string
  operatorLatestRelease: string
  operatorEnvironments: number
  operatorLimitReached: number
  market: string
  port: string
  faucet: string
  faucetResponse: string
  faucetEthBalance: string
  faucetEthBalanceSufficient: number | string
  faucetOceanBalance: string
  faucetOceanBalanceSufficient: number | string
  lastUpdatedOn: number
}
