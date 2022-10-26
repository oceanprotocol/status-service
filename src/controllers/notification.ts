import { IStatus, ISummary } from '../@types'
import mail from './mail'

export default function notification(statuses: IStatus[]): ISummary[] {
  let summaryAll: ISummary[] = []
  const downApps: ISummary[] = []
  try {
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

    summaryAll.forEach((service) => {
      if (service.status === 'Outage') {
        downApps.push(service)
      }
    })
    downApps.length > 0 && mail(downApps)
  } catch (error) {
    console.log(`#: Failed to send notifications: ${error.message}`)
  }
  return downApps
}
