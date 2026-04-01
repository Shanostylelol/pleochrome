import { z } from 'zod'
import { createRouter, protectedProcedure } from '../trpc'

export const searchRouter = createRouter({
  global: protectedProcedure
    .input(z.object({ query: z.string().min(1).max(200) }))
    .query(async ({ ctx, input }) => {
      const raw = input.query.trim()

      // Parse prefix filters: "blocked:", "overdue:", "phase:lead", "status:paused"
      const prefixMatch = raw.match(/^(blocked|overdue|phase|status|assigned):(.*)$/i)

      if (prefixMatch) {
        const [, prefix, value] = prefixMatch
        const v = value.trim()

        if (prefix === 'blocked') {
          const { data } = await ctx.db.from('tasks').select('id, title, status, asset_id')
            .eq('status', 'blocked').eq('is_deleted', false).limit(20)
          return { assets: [], partners: [], contacts: [], documents: [], tasks: data ?? [], meetings: [] }
        }
        if (prefix === 'overdue') {
          const { data } = await ctx.db.from('tasks').select('id, title, status, asset_id, due_date')
            .in('status', ['todo', 'in_progress']).lt('due_date', new Date().toISOString())
            .eq('is_deleted', false).limit(20)
          return { assets: [], partners: [], contacts: [], documents: [], tasks: data ?? [], meetings: [] }
        }
        if (prefix === 'phase' && v) {
          const { data } = await ctx.db.from('assets').select('id, name, reference_code, asset_type, current_phase, value_model, status')
            .eq('current_phase', v as never).eq('is_deleted', false).in('status', ['active', 'paused']).limit(20)
          return { assets: data ?? [], partners: [], contacts: [], documents: [], tasks: [], meetings: [] }
        }
        if (prefix === 'status' && v) {
          const { data } = await ctx.db.from('assets').select('id, name, reference_code, asset_type, current_phase, value_model, status')
            .eq('status', v as never).eq('is_deleted', false).limit(20)
          return { assets: data ?? [], partners: [], contacts: [], documents: [], tasks: [], meetings: [] }
        }
        if (prefix === 'assigned' && v) {
          const { data } = await ctx.db.from('tasks').select('id, title, status, asset_id, team_members!tasks_assigned_to_fkey(full_name)')
            .ilike('team_members.full_name' as any, `%${v}%`).eq('is_deleted', false)
            .in('status', ['todo', 'in_progress', 'blocked']).limit(20)
          return { assets: [], partners: [], contacts: [], documents: [], tasks: data ?? [], meetings: [] }
        }
      }

      // Standard name-based search
      const q = `%${raw}%`
      const [assets, partners, contacts, documents, tasks, meetings] = await Promise.all([
        ctx.db.from('assets').select('id, name, reference_code, asset_type, current_phase, value_model, status')
          .or(`name.ilike.${q},reference_code.ilike.${q}`).limit(5),
        ctx.db.from('partners').select('id, name, type, dd_status').ilike('name', q).limit(5),
        ctx.db.from('contacts').select('id, full_name, contact_type, email, kyc_status')
          .or(`full_name.ilike.${q},email.ilike.${q},entity_name.ilike.${q}`).eq('is_deleted', false).limit(5),
        ctx.db.from('documents').select('id, title, filename, document_type, asset_id')
          .or(`title.ilike.${q},filename.ilike.${q}`).limit(5),
        ctx.db.from('tasks').select('id, title, status, asset_id').ilike('title', q).limit(5),
        ctx.db.from('meeting_notes').select('id, title, meeting_date').ilike('title', q).limit(5),
      ])

      return {
        assets: assets.data ?? [], partners: partners.data ?? [],
        contacts: contacts.data ?? [], documents: documents.data ?? [],
        tasks: tasks.data ?? [], meetings: meetings?.data ?? [],
      }
    }),

  getQuickFilterCounts: protectedProcedure.query(async ({ ctx }) => {
    const [blocked, overdue, leadCount] = await Promise.all([
      ctx.db.from('tasks').select('id', { count: 'exact', head: true })
        .eq('status', 'blocked').eq('is_deleted', false),
      ctx.db.from('tasks').select('id', { count: 'exact', head: true })
        .in('status', ['todo', 'in_progress']).lt('due_date', new Date().toISOString()).eq('is_deleted', false),
      ctx.db.from('assets').select('id', { count: 'exact', head: true })
        .eq('current_phase', 'lead').eq('is_deleted', false).in('status', ['active', 'paused']),
    ])

    return {
      blocked: blocked.count ?? 0,
      overdue: overdue.count ?? 0,
      inLead: leadCount.count ?? 0,
    }
  }),
})
