import { Client } from '@elastic/elasticsearch'
import { IStatus } from '../@types'
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
