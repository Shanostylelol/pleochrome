import { createRouter } from '../trpc'
import { healthRouter } from './health'
import { assetsRouter } from './assets'
import { stagesRouter } from './stages'
import { tasksRouter } from './tasks'
import { subtasksRouter } from './subtasks'
import { documentsRouter } from './documents'
import { commentsRouter } from './comments'
import { approvalsRouter } from './approvals'
import { notificationsRouter } from './notifications'
import { contactsRouter } from './contacts'
import { ownershipRouter } from './ownership'
import { kycRouter } from './kyc'
import { partnersRouter } from './partners'
import { communicationsRouter } from './communications'
import { meetingsRouter } from './meetings'
import { templatesRouter } from './templates'
import { reportsRouter } from './reports'
import { sopsRouter } from './sops'
import { remindersRouter } from './reminders'
import { searchRouter } from './search'
import { activityRouter } from './activity'
import { dashboardRouter } from './dashboard'
import { teamRouter } from './team'
import { interestRouter } from './interest'

export const appRouter = createRouter({
  health: healthRouter,
  assets: assetsRouter,
  stages: stagesRouter,
  tasks: tasksRouter,
  subtasks: subtasksRouter,
  documents: documentsRouter,
  comments: commentsRouter,
  approvals: approvalsRouter,
  notifications: notificationsRouter,
  contacts: contactsRouter,
  ownership: ownershipRouter,
  kyc: kycRouter,
  partners: partnersRouter,
  communications: communicationsRouter,
  meetings: meetingsRouter,
  templates: templatesRouter,
  reports: reportsRouter,
  sops: sopsRouter,
  reminders: remindersRouter,
  search: searchRouter,
  activity: activityRouter,
  dashboard: dashboardRouter,
  team: teamRouter,
  interest: interestRouter,
})

export type AppRouter = typeof appRouter
