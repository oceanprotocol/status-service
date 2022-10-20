import { IStatus, ISummary } from '../@types'
import mail from './mail'

export default function notification(statuses: IStatus[]): ISummary[] {
  let summaryAll: ISummary[] = []
  statuses.forEach((status) => {
    const summary: ISummary[] = []

    status.components.forEach((component) => {
      summary.push({
        name: component.name,
        status: component.status,
        network: status.network
      })
    })

    summaryAll = summaryAll.concat(summary)
  })

  const downApps: ISummary[] = []

  summaryAll.forEach((service) => {
    if (service.status === 'Outage') {
      downApps.push(service)
    }
  })
  downApps.length > 0 && mail(downApps)

  return downApps
}
