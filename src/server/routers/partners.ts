import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter, protectedProcedure } from '../trpc'

export const partnersRouter = createRouter({
  list: protectedProcedure
    .input(
      z.object({
        partnerType: z.string().optional(),
        search: z.string().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      let query = ctx.db
        .from('partners')
        .select('*')
        .order('name', { ascending: true })

      if (input?.partnerType) query = query.eq('type', input.partnerType as never)
      if (input?.search) query = query.ilike('name', `%${input.search}%`)

      const { data, error } = await query
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  getById: protectedProcedure
    .input(z.object({ partnerId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('partners')
        .select('*')
        .eq('id', input.partnerId)
        .single()

      if (error) throw new TRPCError({ code: 'NOT_FOUND', message: 'Partner not found' })
      return data
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        partnerType: z.string(),
        contactName: z.string().optional(),
        contactEmail: z.string().email().optional(),
        contactPhone: z.string().optional(),
        website: z.string().optional(),
        description: z.string().max(2000).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('partners')
        .insert({
          name: input.name,
          type: input.partnerType,
          contact_name: input.contactName ?? null,
          contact_email: input.contactEmail ?? null,
          contact_phone: input.contactPhone ?? null,
          website: input.website ?? null,
          notes: input.description ?? null,
        } as never)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),
})
