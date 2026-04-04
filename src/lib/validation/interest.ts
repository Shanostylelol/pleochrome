import { z } from 'zod'

export const submitInterestInput = z.object({
  fullName: z.string().min(2).max(200),
  email: z.string().email(),
  entity: z.string().max(200).optional(),
  investorType: z.enum(['individual', 'family_office', 'fund_institution', 'advisor_consultant', 'other']),
  accreditedStatus: z.enum(['self_certified_accredited', 'not_accredited', 'prefer_not_to_say']),
  assetInterests: z.array(z.string()).optional(),
  investmentRange: z.enum(['under_100k', '100k_500k', '500k_1m', '1m_5m', '5m_plus', '']).optional(),
  referralSource: z.string().max(500).optional(),
})
