import { createRouter } from '../trpc'
import { healthRouter } from './health'
import { assetsRouter } from './assets'
import { documentsRouter } from './documents'
import { tasksRouter } from './tasks'
import { partnersRouter } from './partners'
import { meetingsRouter } from './meetings'
import { searchRouter } from './search'

export const appRouter = createRouter({
  health: healthRouter,
  assets: assetsRouter,
  documents: documentsRouter,
  tasks: tasksRouter,
  partners: partnersRouter,
  meetings: meetingsRouter,
  search: searchRouter,
})

export type AppRouter = typeof appRouter
