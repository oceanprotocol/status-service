export interface Status {
  network: string
  aquarius?: 'UP' | 'DOWN' | 'WARNING'
  provider?: 'UP' | 'DOWN' | 'WARNING'
  subgraph?: 'UP' | 'DOWN' | 'WARNING'
  market?: 'UP' | 'DOWN'
  port?: 'UP' | 'DOWN'
  faucet?: string
  operatorEngine?: string
}
