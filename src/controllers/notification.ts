import { IStatus, ISummary } from '../@types'
import mail from './mail'

export default function notification(statuses: IStatus[]): ISummary[] {
  let summaryAll: ISummary[] = []
  statuses.forEach((status) => {
    const summary: ISummary[] = [
      {
        name: 'Aquarius',
        status: status.components.aquarius.status,
        network: status.network
      },
      {
        name: 'Provider',
        status: status.components.provider.status,
        network: status.network
      },
      {
        name: 'Subgraph',
        status: status.components.subgraph.status,
        network: status.network
      },
      {
        name: 'Operator Service',
        status: status.components.operator.status,
        network: status.network
      },
      {
        name: 'Market',
        status: status.components.market.status,
        network: status.network
      },
      {
        name: 'Data Farming (https://df.oceandao.org/rewards)',
        status: status.components.dataFarming.status,
        network: status.network
      }
    ]

    summaryAll = summaryAll.concat(summary)
  })

  const downApps: ISummary[] = []

  summaryAll.forEach((service) => {
    if (service.status === 'DOWN') {
      downApps.push(service)
    }
  })
  downApps.length > 0 && mail(downApps)

  return downApps
}
