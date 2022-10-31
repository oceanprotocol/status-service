import { Client } from '@elastic/elasticsearch'
import { IStatus, ISummary, NotificationType, Notification } from '../@types'
import 'dotenv/config'
export async function connection(): Promise<Client> {
  try {
    const client = new Client({
      node: process.env.DB_URL || 'https://localhost:9200',
      auth: {
        username: process.env.DB_USER || 'elastic',
        password: process.env.DB_PASS || 'changeme'
      },
      tls: {
        rejectUnauthorized: false
      }
    })

    return client
  } catch (error) {
    console.log('es connection error:', error)
  }
}

export async function insertMany(status: IStatus[]): Promise<string> {
  try {
    const client = await connection()
    await status.forEach(async (x) => {
      await client.index({
        index: 'monitoring',
        id: x.network + Date.now().toString(),
        body: x
      })
    })

    return 'status inserted into ElasticSearch'
  } catch (error) {
    return `es insert error: ${error}`
  }
}
export async function getNotification(type: NotificationType) {
  const client = await connection()
  const result = await client.search({
    body: {
      from: 0,
      size: 1,
      query: {
        bool: {
          should: [
            {
              match: {
                _index: 'notifications'
              }
            },
            {
              match: {
                type: type
              }
            }
          ]
        }
      },
      sort: {
        lastUpdatedOn: 'desc'
      }
    }
  })
  return result.hits.hits[0]._source as Notification
}

export async function addNotification(type: string, services: ISummary[]) {
  try {
    const client = await connection()

    await client.index({
      index: 'notifications',
      id: type + Date.now().toString(),
      document: {
        type,
        services,
        lastUpdatedOn: Date.now()
      }
    })
  } catch (error) {
    console.log(`#: Failed to add notification in db: ${error.message}`)
  }
}
