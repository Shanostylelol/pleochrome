import { TRPCError } from '@trpc/server'
import { createRouter, publicProcedure } from '../trpc'
import { submitInterestInput } from '@/lib/validation/interest'

export const interestRouter = createRouter({
  submit: publicProcedure
    .input(submitInterestInput)
    .mutation(async ({ ctx, input }) => {
      // Check for duplicate email
      const { data: existing } = await ctx.db
        .from('contacts')
        .select('id')
        .eq('email', input.email)
        .eq('is_deleted', false)
        .maybeSingle()

      if (existing) {
        // Update existing contact metadata instead of creating duplicate
        await ctx.db
          .from('contacts')
          .update({
            metadata: {
              investor_type: input.investorType,
              accredited_status: input.accreditedStatus,
              asset_interests: input.assetInterests ?? [],
              investment_range: input.investmentRange ?? '',
              referral_source: input.referralSource ?? '',
              interest_updated_at: new Date().toISOString(),
            },
          } as never)
          .eq('id', existing.id)

        return { success: true, message: 'Interest updated' }
      }

      // Create new contact
      const contactType = input.entity ? 'entity' : 'individual'
      const { error } = await ctx.db
        .from('contacts')
        .insert({
          full_name: input.fullName,
          email: input.email,
          entity_name: input.entity || null,
          contact_type: contactType,
          relationship_status: 'prospect',
          source: 'interest_page',
          tags: ['interest_page', 'investor_interest'],
          metadata: {
            investor_type: input.investorType,
            accredited_status: input.accreditedStatus,
            asset_interests: input.assetInterests ?? [],
            investment_range: input.investmentRange ?? '',
            referral_source: input.referralSource ?? '',
            submitted_at: new Date().toISOString(),
          },
        } as never)

      if (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to submit interest' })
      }

      return { success: true, message: 'Interest registered' }
    }),
})
