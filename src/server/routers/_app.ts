import { createRouter } from '../trpc'
import { healthRouter } from './health'
import { assetsRouter } from './assets'
import { documentsRouter } from './documents'
import { tasksRouter } from './tasks'
import { partnersRouter } from './partners'
import { meetingsRouter } from './meetings'
import { searchRouter } from './search'
import { governanceRouter } from './governance'
import { activityRouter } from './activity'
import { assetTaskInstancesRouter } from './asset-task-instances'
import { stepsRouter } from './steps'
import { dashboardRouter } from './dashboard'

export const appRouter = createRouter({
  health: healthRouter,
  assets: assetsRouter,
  documents: documentsRouter,
  tasks: tasksRouter,
  partners: partnersRouter,
  meetings: meetingsRouter,
  search: searchRouter,
  governance: governanceRouter,
  activity: activityRouter,
  assetTaskInstances: assetTaskInstancesRouter,
  steps: stepsRouter,
  dashboard: dashboardRouter,
})

export type AppRouter = typeof appRouter
