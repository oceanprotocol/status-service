import { Status } from '../@types'
import mail from './mail'

export default function notification(status: Status) {
  const summary = [
    {
      name: 'Aquarius',
      status: status.aquarius.status
    },
    {
      name: 'Provider',
      status: status.provider.status
    },
    {
      name: 'Subgraph',
      status: status.subgraph.status
    },
    {
      name: 'Operator Service',
      status: status.operatorService.status
    },
    {
      name: 'Market',
      status: status.market
    },
    {
      name: 'Port',
      status: status.market
    },
    {
      name: 'Data Farming (https://df.oceandao.org/rewards)',
      status: status.market
    },
    {
      name: 'DAO Grants Application Portal (https://seed.oceandao.org/)',
      status: status.market
    }
  ]

  const downApps: string[] = []

  summary.forEach((service) => {
    if (service.status === 'DOWN') {
      downApps.push(service.name)
    }
  })
  downApps.length > 0 && mail(downApps)
}
