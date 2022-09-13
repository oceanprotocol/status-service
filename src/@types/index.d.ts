import { BigNumber } from 'ethers'

export interface Status {
  network: string
  aquarius?: 'UP' | 'DOWN' | 'WARNING'
  provider?: 'UP' | 'DOWN' | 'WARNING'
  subgraph?: 'UP' | 'DOWN' | 'WARNING'
  market?: 'UP' | 'DOWN'
  port?: 'UP' | 'DOWN'
  faucet?: FaucetStatus
  operatorEngine?: string
}

export interface FaucetStatus {
  status?: 'UP' | 'DOWN' | 'N/A'
  response?: number | 'N/A'
  ethBalance?: BigNumber | 'N/A'
  ethBalanceSufficient?: boolean | 'N/A'
  oceanBalance?: BigNumber | 'N/A'
  oceanBalanceSufficient?: boolean | 'N/A'
}
