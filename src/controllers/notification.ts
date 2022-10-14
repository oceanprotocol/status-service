import { IStatus, ISummary } from '../@types'
import mail from './mail'

export default function notification(statuses: IStatus[]): ISummary[] {
  console.log('statuses', statuses)
  const summaryAll: ISummary[] = []
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
        name: 'Port',
        status: status.port,
        network: status.network
      },
      {
        name: 'Data Farming (https://df.oceandao.org/rewards)',
        status: status.dataFarming,
        network: status.network
      },
      {
        name: 'DAO Grants Application Portal (https://seed.oceandao.org/)',
        status: status.daoGrants,
        network: status.network
      }
    ]
    summaryAll.concat(summary)
  })
  console.log('summaryAll', summaryAll)
  const downApps: ISummary[] = []

  summaryAll.forEach((service) => {
    if (service.status === 'DOWN') {
      downApps.push(service)
    }
  })
  downApps.length > 0 && mail(downApps)
  console.log('summaryAll', summaryAll)
  return downApps
}
