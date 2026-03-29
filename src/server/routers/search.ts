import { z } from 'zod'
import { createRouter, protectedProcedure } from '../trpc'

export const searchRouter = createRouter({
  global: protectedProcedure
    .input(z.object({ query: z.string().min(1).max(200) }))
    .query(async ({ ctx, input }) => {
      const q = `%${input.query}%`

      const [assets, partners, documents, tasks, meetings] = await Promise.all([
        ctx.db
          .from('assets')
          .select('id, name, reference_code, asset_type, current_phase, value_path, status')
          .or(`name.ilike.${q},reference_code.ilike.${q}`)
          .limit(5),
        ctx.db
          .from('partners')
          .select('id, name, type, dd_status')
          .ilike('name', q)
          .limit(5),
        ctx.db
          .from('documents')
          .select('id, title, filename, document_type, asset_id')
          .or(`title.ilike.${q},filename.ilike.${q}`)
          .limit(5),
        ctx.db
          .from('tasks')
          .select('id, title, status, priority, asset_id')
          .ilike('title', q)
          .limit(5),
        ctx.db
          .from('meeting_notes')
          .select('id, title, meeting_date')
          .ilike('title', q)
          .limit(5),
      ])

      return {
        assets: assets.data ?? [],
        partners: partners.data ?? [],
        documents: documents.data ?? [],
        tasks: tasks.data ?? [],
        meetings: meetings.data ?? [],
      }
    }),
})
