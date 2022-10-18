import { IStatus, ISummary } from '../@types'
import mail from './mail'

export default function notification(statuses: IStatus[]): ISummary[] {
  let summaryAll: ISummary[] = []
  statuses.forEach((status) => {
    const summary: ISummary[] = [
      {
        name: 'Aquarius',
        status: status.aquarius.status,
        network: status.network
      },
      {
        name: 'Provider',
        status: status.provider.status,
        network: status.network
      },
      {
        name: 'Subgraph',
        status: status.subgraph.status,
        network: status.network
      },
      {
        name: 'Operator Service',
        status: status.operator.status,
        network: status.network
      },
      {
        name: 'Market',
        status: status.market,
        network: status.network
      },
      {
        name: 'Data Farming (https://df.oceandao.org/rewards)',
        status: status.dataFarming,
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
