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
  status?: 'UP' | 'DOWN'
  ethBalance?: BigNumber
  ethBalanceSufficient?: boolean
  oceanBalance?: BigNumber
  oceanBalanceSufficient?: boolean
}
