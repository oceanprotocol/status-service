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
