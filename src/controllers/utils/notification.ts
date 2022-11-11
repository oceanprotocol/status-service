import { IStatus, ISummary, State } from '../../@types'
import { sendOutageMessage } from './slack'

export default async function notification(statuses: IStatus[]) {
  let summaryAll: ISummary[] = []
  const downApps: ISummary[] = []
  try {
    statuses.forEach((status) => {
      const summary: ISummary[] = []

      status.components.forEach((component) => {
        summary.push({
          name: component.name,
          status: component.status,
          network: status.network,
          error: component.error
        })
      })

      summaryAll = summaryAll.concat(summary)
    })

    const issues = summaryAll
      .filter((x) => x.status === State.Degraded || x.status === State.Outage)
      .sort((a, b) => {
        if (a.status === State.Degraded) return 1
        if (b.status === State.Degraded) return -1
      })
    issues.length > 0 && (await sendOutageMessage(issues))
  } catch (error) {
    console.log(`#: Failed to send notifications: ${error.message}`)
  }
  return downApps
}
