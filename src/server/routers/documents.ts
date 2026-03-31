import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter, protectedProcedure } from '../trpc'
import { uuidSchema } from '@/lib/validation/shared'

export const documentsRouter = createRouter({
  // ── List documents (global or filtered) ────────────────────────
  list: protectedProcedure
    .input(z.object({
      assetId: uuidSchema.optional(),
      taskId: uuidSchema.optional(),
      subtaskId: uuidSchema.optional(),
      stageId: uuidSchema.optional(),
      partnerId: uuidSchema.optional(),
      documentType: z.string().optional(),
      search: z.string().max(200).optional(),
      uploadedBy: uuidSchema.optional(),
      dateFrom: z.string().optional(),
      dateTo: z.string().optional(),
      limit: z.number().int().min(1).max(200).default(100),
    }).optional())
    .query(async ({ ctx, input }) => {
      let query = ctx.db
        .from('documents')
        .select('*, assets!documents_asset_id_fkey(name, reference_code), team_members!documents_uploaded_by_fkey(full_name)')
        .eq('is_current', true)
        .order('uploaded_at', { ascending: false })

      if (input?.assetId) query = query.eq('asset_id', input.assetId)
      if (input?.taskId) query = query.eq('task_id', input.taskId)
      if (input?.subtaskId) query = query.eq('subtask_id', input.subtaskId)
      if (input?.stageId) query = query.eq('stage_id', input.stageId)
      if (input?.partnerId) query = query.eq('partner_id', input.partnerId)
      if (input?.documentType) query = query.eq('document_type', input.documentType)
      if (input?.uploadedBy) query = query.eq('uploaded_by', input.uploadedBy)
      if (input?.dateFrom) query = query.gte('uploaded_at', input.dateFrom)
      if (input?.dateTo) query = query.lte('uploaded_at', input.dateTo)
      if (input?.search) query = query.or(`filename.ilike.%${input.search}%,title.ilike.%${input.search}%`)

      const { data, error } = await query.limit(input?.limit ?? 100)
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  // ── List by task ───────────────────────────────────────────────
  listByTask: protectedProcedure
    .input(z.object({ taskId: uuidSchema }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('documents')
        .select('*, team_members!documents_uploaded_by_fkey(full_name)')
        .eq('task_id', input.taskId)
        .eq('is_current', true)
        .order('uploaded_at', { ascending: false })

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  // ── List by subtask ───────────────────────────────────────────
  listBySubtask: protectedProcedure
    .input(z.object({ subtaskId: uuidSchema }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('documents')
        .select('*, team_members!documents_uploaded_by_fkey(full_name)')
        .eq('subtask_id', input.subtaskId)
        .eq('is_current', true)
        .order('uploaded_at', { ascending: false })

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  // ── Get stats ──────────────────────────────────────────────────
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const { data } = await ctx.db
      .from('documents')
      .select('id, file_size_bytes, is_locked')
      .eq('is_current', true)

    const docs = data ?? []
    return {
      totalDocuments: docs.length,
      totalSizeBytes: docs.reduce((sum, d) => sum + (d.file_size_bytes ?? 0), 0),
      lockedCount: docs.filter(d => d.is_locked).length,
    }
  }),

  // ── Get download URL ───────────────────────────────────────────
  getDownloadUrl: protectedProcedure
    .input(z.object({ documentId: uuidSchema }))
    .query(async ({ ctx, input }) => {
      const { data: doc } = await ctx.db
        .from('documents')
        .select('storage_bucket, storage_path, filename')
        .eq('id', input.documentId)
        .single()

      if (!doc) throw new TRPCError({ code: 'NOT_FOUND', message: 'Document not found' })

      const { data } = await ctx.db.storage
        .from(doc.storage_bucket)
        .createSignedUrl(doc.storage_path, 3600)

      if (!data?.signedUrl) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Could not generate download URL' })
      return { url: data.signedUrl, filename: doc.filename }
    }),

  // ── Create document ────────────────────────────────────────────
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1).max(500),
      filename: z.string().min(1).max(500),
      storagePath: z.string().min(1),
      storageBucket: z.string().min(1),
      mimeType: z.string().min(1),
      fileSizeBytes: z.number().int().positive(),
      documentType: z.string().default('other'),
      assetId: uuidSchema.optional(),
      stageId: uuidSchema.optional(),
      taskId: uuidSchema.optional(),
      subtaskId: uuidSchema.optional(),
      partnerId: uuidSchema.optional(),
      contactId: uuidSchema.optional(),
      description: z.string().max(1000).optional(),
      tags: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from('documents')
        .insert({
          title: input.title,
          filename: input.filename,
          storage_path: input.storagePath,
          storage_bucket: input.storageBucket,
          mime_type: input.mimeType,
          file_size_bytes: input.fileSizeBytes,
          document_type: input.documentType,
          asset_id: input.assetId ?? null,
          stage_id: input.stageId ?? null,
          task_id: input.taskId ?? null,
          subtask_id: input.subtaskId ?? null,
          partner_id: input.partnerId ?? null,
          contact_id: input.contactId ?? null,
          description: input.description ?? null,
          tags: input.tags ?? [],
          uploaded_by: ctx.user.id,
          version: 1,
        } as never)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

      // Notify team members about document upload (if linked to an asset)
      if (input.assetId) {
        const { data: teamMembers } = await ctx.db
          .from('team_members')
          .select('id')
          .eq('is_active', true)
          .neq('id', ctx.user.id)

        if (teamMembers && teamMembers.length > 0) {
          const notifications = teamMembers.map((m) => ({
            recipient_id: m.id,
            title: 'Document uploaded',
            message: `${ctx.user.full_name} uploaded "${input.filename}"`,
            type: 'document_uploaded' as never,
            asset_id: input.assetId ?? null,
            task_id: input.taskId ?? null,
          }))
          await ctx.db.from('notifications').insert(notifications as never[])
        }
      }

      return data
    }),

  // ── Update document metadata ───────────────────────────────────
  update: protectedProcedure
    .input(z.object({
      documentId: uuidSchema,
      title: z.string().min(1).max(500).optional(),
      documentType: z.string().optional(),
      description: z.string().max(1000).optional().nullable(),
      tags: z.array(z.string()).optional(),
      notes: z.string().max(2000).optional().nullable(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data: doc } = await ctx.db
        .from('documents')
        .select('is_locked')
        .eq('id', input.documentId)
        .single()

      if (!doc) throw new TRPCError({ code: 'NOT_FOUND', message: 'Document not found' })
      if (doc.is_locked) throw new TRPCError({ code: 'FORBIDDEN', message: 'Cannot update a locked document' })

      const updates: Record<string, unknown> = {}
      if (input.title !== undefined) updates.title = input.title
      if (input.documentType !== undefined) updates.document_type = input.documentType
      if (input.description !== undefined) updates.description = input.description
      if (input.tags !== undefined) updates.tags = input.tags
      if (input.notes !== undefined) updates.notes = input.notes

      if (Object.keys(updates).length === 0) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'No fields to update' })
      }

      const { data, error } = await ctx.db
        .from('documents')
        .update(updates as never)
        .eq('id', input.documentId)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // ── Lock / Unlock ──────────────────────────────────────────────
  toggleLock: protectedProcedure
    .input(z.object({ documentId: uuidSchema, lockReason: z.string().max(500).optional() }))
    .mutation(async ({ ctx, input }) => {
      const { data: doc } = await ctx.db
        .from('documents')
        .select('is_locked')
        .eq('id', input.documentId)
        .single()

      if (!doc) throw new TRPCError({ code: 'NOT_FOUND', message: 'Document not found' })

      const newLocked = !doc.is_locked
      const { data, error } = await ctx.db
        .from('documents')
        .update({
          is_locked: newLocked,
          locked_by: newLocked ? ctx.user.id : null,
          locked_at: newLocked ? new Date().toISOString() : null,
          lock_reason: newLocked ? (input.lockReason ?? null) : null,
        } as never)
        .eq('id', input.documentId)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // ── Delete (soft — respects lock) ──────────────────────────────
  delete: protectedProcedure
    .input(z.object({ documentId: uuidSchema }))
    .mutation(async ({ ctx, input }) => {
      const { data: doc } = await ctx.db
        .from('documents')
        .select('is_locked, storage_bucket, storage_path')
        .eq('id', input.documentId)
        .single()

      if (!doc) throw new TRPCError({ code: 'NOT_FOUND', message: 'Document not found' })
      if (doc.is_locked) throw new TRPCError({ code: 'FORBIDDEN', message: 'Cannot delete a locked document' })

      await ctx.db.storage.from(doc.storage_bucket).remove([doc.storage_path])

      const { error } = await ctx.db
        .from('documents')
        .delete()
        .eq('id', input.documentId)

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return { success: true }
    }),

  // ── Required checklist per stage ───────────────────────────────
  getRequiredChecklist: protectedProcedure
    .input(z.object({ assetId: uuidSchema }))
    .query(async ({ ctx, input }) => {
      const { data: stages } = await ctx.db
        .from('asset_stages')
        .select('id, name, phase, required_document_types')
        .eq('asset_id', input.assetId)
        .eq('is_hidden', false)
        .order('phase')
        .order('sort_order')

      const { data: docs } = await ctx.db
        .from('documents')
        .select('document_type, stage_id')
        .eq('asset_id', input.assetId)
        .eq('is_current', true)

      const uploadedTypes = new Set((docs ?? []).map(d => `${d.stage_id}:${d.document_type}`))

      return (stages ?? [])
        .filter(s => s.required_document_types && s.required_document_types.length > 0)
        .map(s => ({
          stageId: s.id,
          stageName: s.name,
          phase: s.phase,
          requirements: (s.required_document_types ?? []).map(docType => ({
            documentType: docType,
            uploaded: uploadedTypes.has(`${s.id}:${docType}`),
          })),
        }))
    }),

  // ── Batch download paths (for JSZip) ───────────────────────────
  batchDownloadPaths: protectedProcedure
    .input(z.object({
      assetId: uuidSchema,
      documentIds: z.array(uuidSchema).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.db.rpc('batch_document_paths', {
        p_asset_id: input.assetId,
        p_document_ids: input.documentIds ?? undefined,
      })

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data ?? []
    }),

  // ── Version history ──────────────────────────────────────────────
  getVersionHistory: protectedProcedure
    .input(z.object({ documentId: uuidSchema }))
    .query(async ({ ctx, input }) => {
      const { data: doc } = await ctx.db
        .from('documents')
        .select('id, parent_document_id')
        .eq('id', input.documentId)
        .single()

      if (!doc) throw new TRPCError({ code: 'NOT_FOUND', message: 'Document not found' })

      const rootId = doc.parent_document_id ?? doc.id
      const { data: versions } = await ctx.db
        .from('documents')
        .select('id, version, title, filename, file_size_bytes, uploaded_at, is_current, team_members!documents_uploaded_by_fkey(full_name)')
        .or(`id.eq.${rootId},parent_document_id.eq.${rootId}`)
        .order('version', { ascending: false })

      return versions ?? []
    }),

  // ── Create new version ───────────────────────────────────────────
  createNewVersion: protectedProcedure
    .input(z.object({
      parentDocumentId: uuidSchema,
      title: z.string().min(1).max(500).optional(),
      filename: z.string().min(1).max(500),
      storagePath: z.string().min(1),
      storageBucket: z.string().min(1),
      mimeType: z.string().min(1),
      fileSizeBytes: z.number().int().positive(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data: parent } = await ctx.db
        .from('documents')
        .select('*')
        .eq('id', input.parentDocumentId)
        .single()

      if (!parent) throw new TRPCError({ code: 'NOT_FOUND', message: 'Parent document not found' })
      if (parent.is_locked) throw new TRPCError({ code: 'FORBIDDEN', message: 'Cannot replace a locked document' })

      const rootId = parent.parent_document_id ?? parent.id

      // Get highest version
      const { data: versions } = await ctx.db
        .from('documents')
        .select('version')
        .or(`id.eq.${rootId},parent_document_id.eq.${rootId}`)
        .order('version', { ascending: false })
        .limit(1)

      const nextVersion = ((versions?.[0]?.version ?? parent.version) + 1)

      // Mark all previous versions as not current
      await ctx.db
        .from('documents')
        .update({ is_current: false } as never)
        .or(`id.eq.${rootId},parent_document_id.eq.${rootId}`)

      // Insert new version
      const { data, error } = await ctx.db
        .from('documents')
        .insert({
          asset_id: parent.asset_id,
          stage_id: parent.stage_id,
          task_id: parent.task_id,
          subtask_id: parent.subtask_id,
          partner_id: parent.partner_id,
          contact_id: parent.contact_id,
          document_type: parent.document_type,
          title: input.title ?? parent.title,
          filename: input.filename,
          storage_path: input.storagePath,
          storage_bucket: input.storageBucket,
          mime_type: input.mimeType,
          file_size_bytes: input.fileSizeBytes,
          parent_document_id: rootId,
          version: nextVersion,
          is_current: true,
          uploaded_by: ctx.user.id,
          tags: parent.tags ?? [],
          description: parent.description,
        } as never)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),
})
