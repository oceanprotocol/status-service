import fetch from 'cross-fetch'
import { ISummary, NotificationType, State } from '../../@types'
import { addNotification, getNotification } from '../../db/elasticsearch'

const objectsEqual = (o1, o2) =>
  typeof o1 === 'object' && Object.keys(o1).length > 0
    ? Object.keys(o1).length === Object.keys(o2).length &&
      Object.keys(o1).every((p) => objectsEqual(o1[p], o2[p]))
    : o1 === o2

function addHours(numOfHours, date = new Date()) {
  date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000)

  return date
}

function getBaseBlock() {
  return {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: 'Ooops there are some issues :scream:',
          emoji: true
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Check the <https://status.oceanprotocol.com/|status page> for more details'
        }
      }
    ]
  }
}

function getSectionText(summary: ISummary) {
  return `Network : ${summary.network} | Component: ${summary.name} | Status: ${summary.status}\n`
}

export async function sendOutageMessage(issues: ISummary[]) {
  try {
    const lastNotification = await getNotification(NotificationType.DevOps)
    const sameIssues =
      lastNotification &&
      objectsEqual(
        issues?.filter((x) => x.status === State.Outage),
        lastNotification?.services?.filter((x) => x.status === State.Outage)
      )

    //   if (
    //     sameIssues &&
    //     Date.now() < addHours(1, new Date(lastNotification.lastUpdatedOn)).getTime()
    //   )
    //     return
    if (
      sameIssues ||
      issues.filter((x) => x.status === State.Outage).length === 0
    )
      return
    addNotification(NotificationType.DevOps, issues)

    const baseBlock = getBaseBlock()
    let sectionText = ''
    issues.forEach((issue) => {
      sectionText += getSectionText(issue)
    })

    baseBlock.blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text:
          ' ```' + sectionText.substring(0, sectionText.length - 1) + ' ``` '
      }
    })

    //send it

    const response = await fetch(process.env.SLACK_DEVOPS_CHANNEL, {
      method: 'post',
      body: JSON.stringify(baseBlock)
    })

    response.ok && console.log('Message sent to slack channel')
  } catch (error) {
    console.log(`#: Failed to send notification to slack : ${error.message}`)
  }
}
