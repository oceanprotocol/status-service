import { Schema } from 'mongoose'
import { IStatus, State } from '../@types'

export const statusSchema = new Schema<IStatus>({
  network: { type: String, required: true },
  currentBlock: { type: Number, required: true },

  components: {
    market: {
      status: {
        type: String,
        enum: State,
        required: true,
        default: State.Warning
      }
    },
    dataFarming: {
      status: {
        type: String,
        enum: State,
        required: true,
        default: State.Warning
      }
    },
    faucet: {
      status: {
        type: String,
        enum: State
      },
      response: Number,
      ethBalance: String,
      ethBalanceSufficient: Boolean,
      oceanBalance: String,
      oceanBalanceSufficient: Boolean
    },
    aquarius: {
      status: {
        type: String,
        enum: State,
        required: true,
        default: State.Warning
      },
      statusMessages: [{ type: String }],
      response: Number,
      validChainList: Boolean,
      version: String,
      monitorVersion: String,
      latestRelease: String,
      block: Number,
      validQuery: Boolean
    },
    provider: {
      status: {
        type: String,
        enum: State,
        required: true,
        default: State.Warning
      },
      statusMessages: [{ type: String }],
      response: Number,
      version: String,
      latestRelease: String
    },
    subgraph: {
      status: {
        type: String,
        enum: State,
        required: true,
        default: State.Warning
      },
      statusMessages: [{ type: String }],
      response: Number,
      version: String,
      latestRelease: String,
      block: Number
    },
    operator: {
      status: {
        type: String,
        enum: State,
        required: true,
        default: State.Warning
      },
      statusMessages: [{ type: String }],
      response: Number,
      version: String,
      latestRelease: String,
      environments: Number,
      limitReached: Boolean
    }
  },

  lastUpdatedOn: { type: Number, required: true, default: Date.now }
})
