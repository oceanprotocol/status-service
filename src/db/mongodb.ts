import { model, connect } from 'mongoose'
import { statusSchema } from './schema'
import { IStatus } from '../@types'

const collection = process.env.DB_COLLECTION
  ? process.env.DB_COLLECTION
  : 'Test'
const Status = model<IStatus>(collection, statusSchema)

// Connection URL
const url = process.env.DB_PATH
  ? process.env.DB_PATH
  : 'mongodb://localhost:27017/statusHistory'

export async function connection() {
  try {
    await connect(url)
    console.log('Connected to mongodb')
  } catch (error) {
    console.log('MongoDB connection error:', error)
  }
}

export async function insertMany(status: IStatus[]): Promise<string> {
  try {
    await Status.insertMany(status)
    return 'status inserted into MongoDB'
  } catch (error) {
    return `MongoDB insert error: ${error}`
  }
}
