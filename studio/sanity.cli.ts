import {defineCliConfig} from 'sanity/cli'
import {DATASET, PROJECT_ID} from './project'

export default defineCliConfig({
  api: {
    projectId: PROJECT_ID,
    dataset: DATASET,
  },
  // Hosted at https://carolina-jaime.sanity.studio (`npm run deploy`)
  studioHost: 'carolina-jaime',
  deployment: {appId: 'wk7a2s64r5a1wjbloek933nq', autoUpdates: false},
})
