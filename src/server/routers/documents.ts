import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter, protectedProcedure } from '../trpc'

export const documentsRouter = createRouter({
  list: protectedProcedure
    .input(
      z.object({
        assetId: z.string().uuid().optional(),
        documentType: z.string().optional(),
        search: z.string().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      let query = ctx.db
        .from('documents')
        .select('*, assets!documents_asset_id_fkey(name, reference_code), team_members!documents_uploaded_by_fkey(full_name)')
        .order('uploaded_at', { ascending: false })

      if (input?.assetId) query = query.eq('asset_id', input.assetId)
      if (input?.documentType) query = query.eq('document_type', input.documentType as never)
      if (input?.search) query = query.or(`filename.ilike.%${input.search}%,title.ilike.%${input.search}%`)

      const { data, error } = await query.limit(200)
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.db
      .from('documents')
      .select('id, file_size_bytes, is_locked')

    if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

    const docs = data ?? []
    const totalBytes = docs.reduce((sum, d) => sum + (d.file_size_bytes ?? 0), 0)
    const lockedCount = docs.filter((d) => d.is_locked).length

    return {
      totalDocuments: docs.length,
      totalSizeBytes: totalBytes,
      lockedCount,
    }
  }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(500),
        filename: z.string().min(1).max(500),
        storagePath: z.string().min(1),
        storageBucket: z.string().min(1),
        mimeType: z.string().min(1),
        fileSizeBytes: z.number().int().positive(),
        documentType: z.string().default('other'),
        assetId: z.string().uuid().optional(),
        stepId: z.string().uuid().optional(),
        partnerId: z.string().uuid().optional(),
        description: z.string().max(1000).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const insertPayload = {
        title: input.title,
        filename: input.filename,
        storage_path: input.storagePath,
        storage_bucket: input.storageBucket,
        mime_type: input.mimeType,
        file_size_bytes: input.fileSizeBytes,
        document_type: input.documentType,
        asset_id: input.assetId ?? null,
        step_id: input.stepId ?? null,
        partner_id: input.partnerId ?? null,
        description: input.description ?? null,
        uploaded_by: ctx.user.id,
        version: 1,
      }

      const { data, error } = await ctx.db
        .from('documents')
        .insert(insertPayload as never)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  toggleLock: protectedProcedure
    .input(z.object({ documentId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { data: doc } = await ctx.db
        .from('documents')
        .select('is_locked')
        .eq('id', input.documentId)
        .single()

      if (!doc) throw new TRPCError({ code: 'NOT_FOUND', message: 'Document not found' })

      const { data, error } = await ctx.db
        .from('documents')
        .update({ is_locked: !doc.is_locked })
        .eq('id', input.documentId)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  delete: protectedProcedure
    .input(z.object({ documentId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { data: doc } = await ctx.db
        .from('documents')
        .select('is_locked, storage_path')
        .eq('id', input.documentId)
        .single()

      if (!doc) throw new TRPCError({ code: 'NOT_FOUND', message: 'Document not found' })
      if (doc.is_locked) throw new TRPCError({ code: 'FORBIDDEN', message: 'Cannot delete a locked document' })

      const { error } = await ctx.db
        .from('documents')
        .delete()
        .eq('id', input.documentId)

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return { success: true }
    }),
})
