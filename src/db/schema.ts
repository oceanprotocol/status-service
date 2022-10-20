import { Schema } from 'mongoose'
import { IStatus, State } from '../@types'

export const statusSchema = new Schema<IStatus>({
  network: { type: String, required: true },
  currentBlock: { type: Number },
  lastUpdatedOn: { type: Number, required: true, default: Date.now },
  components: [
    {
      name: String,
      status: {
        type: String,
        enum: State,
        required: true,
        default: State.Outage
      },
      statusMessages: [{ type: String }],
      response: Number,
      url: String,
      version: String,
      latestRelease: String,
      validChainList: Boolean,
      block: Number,
      validQuery: Boolean,
      environments: Number,
      limitReached: Boolean,
      ethBalance: String,
      ethBalanceSufficient: Boolean,
      oceanBalance: String,
      oceanBalanceSufficient: Boolean
    }
  ]
})
