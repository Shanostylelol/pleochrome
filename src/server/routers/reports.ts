import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter, protectedProcedure } from '../trpc'
import { uuidSchema } from '@/lib/validation/shared'

export const reportsRouter = createRouter({
  // ── Generate comprehensive asset report ────────────────────────
  generateAssetReport: protectedProcedure
    .input(z.object({ assetId: uuidSchema }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.db.rpc('generate_asset_report', {
        p_asset_id: input.assetId,
      })

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // ── Batch document download paths (for JSZip client-side) ──────
  batchDocumentDownload: protectedProcedure
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

      // Generate signed URLs for each document
      const paths = (data ?? []) as Array<{
        document_id: string; title: string; filename: string;
        storage_bucket: string; storage_path: string; file_size_bytes: number;
        document_type: string; stage_name: string;
      }>

      const withUrls = await Promise.all(paths.map(async (doc) => {
        const { data: urlData } = await ctx.db.storage
          .from(doc.storage_bucket)
          .createSignedUrl(doc.storage_path, 3600)

        return {
          ...doc,
          signedUrl: urlData?.signedUrl ?? null,
        }
      }))

      return withUrls
    }),
})
