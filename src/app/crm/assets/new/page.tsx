'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'
import { NeuCard, NeuButton, NeuInput, NeuTextarea, NeuSelect } from '@/components/ui'
import { ChevronRight, Check, ArrowLeft, ArrowRight, Gem, Landmark, Coins, Mountain, Package } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ─────────────────────────────────────────────
type AssetType = 'gemstone' | 'real_estate' | 'precious_metal' | 'mineral_rights' | 'other'
// V2: value_model enum values (no 'evaluating', 'debt_instruments' -> 'debt_instrument')
type ValuePath = '' | 'fractional_securities' | 'tokenization' | 'debt_instrument' | 'broker_sale' | 'barter'

interface WizardData {
  name: string
  assetType: AssetType
  holderEntity: string
  description: string
  valuePath: ValuePath
  estimatedValue: string
  origin: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any // allow asset-type-specific extra fields
}

// ─── Constants ─────────────────────────────────────────
const STEPS = [
  { num: 1, label: 'Basic Info' },
  { num: 2, label: 'Value Path' },
  { num: 3, label: 'Valuation' },
  { num: 4, label: 'Review' },
]

const ASSET_TYPE_OPTIONS = [
  { value: 'gemstone', label: 'Gemstone' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'precious_metal', label: 'Precious Metal' },
  { value: 'mineral_rights', label: 'Mineral Rights' },
  { value: 'other', label: 'Other' },
]

const ASSET_TYPE_ICONS: Record<AssetType, React.ReactNode> = {
  gemstone: <Gem className="h-4 w-4" />,
  real_estate: <Landmark className="h-4 w-4" />,
  precious_metal: <Coins className="h-4 w-4" />,
  mineral_rights: <Mountain className="h-4 w-4" />,
  other: <Package className="h-4 w-4" />,
}

const VALUE_PATHS: {
  id: ValuePath
  label: string
  description: string
  color: string
  bgVar: string
}[] = [
  {
    id: '',
    label: 'Undecided',
    description: 'Asset is under evaluation. Value model to be determined after due diligence and partner assessment.',
    color: '#C47A1A',
    bgVar: 'var(--amber-bg)',
  },
  {
    id: 'fractional_securities',
    label: 'Fractional Securities',
    description: 'Reg D 506(c) fractional LLC units. Lower minimums, broader access, SEC-compliant offering structure.',
    color: '#1B6B4A',
    bgVar: 'var(--emerald-bg)',
  },
  {
    id: 'tokenization',
    label: 'Tokenization',
    description: 'ERC-3643 or ERC-7518 security tokens on Polygon with Chainlink Proof of Reserve. On-chain compliance.',
    color: '#1A8B7A',
    bgVar: 'var(--teal-bg)',
  },
  {
    id: 'debt_instrument',
    label: 'Debt Instrument',
    description: 'Asset-backed lending with UCC Article 9 perfected security interest. Collateral-based debt structure.',
    color: '#1E3A6E',
    bgVar: 'var(--sapphire-bg)',
  },
  {
    id: 'broker_sale',
    label: 'Broker Sale',
    description: 'Traditional broker-mediated sale through registered broker-dealer networks.',
    color: '#C47A1A',
    bgVar: 'var(--amber-bg)',
  },
  {
    id: 'barter',
    label: 'Barter',
    description: 'Direct asset-for-asset exchange or trade arrangement.',
    color: '#666',
    bgVar: 'var(--bg-body)',
  },
]

const PATH_LABEL: Record<string, string> = {
  '': 'Undecided',
  fractional_securities: 'Fractional Securities',
  tokenization: 'Tokenization',
  debt_instrument: 'Debt Instrument',
  broker_sale: 'Broker Sale',
  barter: 'Barter',
}

// ═══════════════════════════════════════════════════════
export default function NewAssetPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<WizardData>({
    name: '',
    assetType: 'gemstone',
    holderEntity: '',
    description: '',
    valuePath: '',
    estimatedValue: '',
    origin: '',
  })

  const utils = trpc.useUtils()
  const createMutation = trpc.assets.create.useMutation({
    onSuccess: (created) => {
      utils.assets.list.invalidate()
      utils.assets.getStats.invalidate()
      router.push(`/crm/assets/${created.asset.id}`)
    },
  })

  const update = (fields: Partial<WizardData>) => setData((prev) => ({ ...prev, ...fields }))

  const canAdvance = (): boolean => {
    if (step === 1) return data.name.trim().length > 0 && data.holderEntity.trim().length > 0
    return true
  }

  const handleSubmit = () => {
    if (!data.name.trim() || !data.holderEntity.trim()) return

    // Collect asset-type-specific metadata from wizard fields
    const typeMetadata: Record<string, unknown> = {}
    if (data.assetType === 'gemstone') {
      if (data.giaReport) typeMetadata.gia_report_number = data.giaReport
    } else if (data.assetType === 'real_estate') {
      if (data.propertyAddress) typeMetadata.property_address = data.propertyAddress
      if (data.propertyType) typeMetadata.property_type = data.propertyType
      if (data.sqFootage) typeMetadata.sq_footage = data.sqFootage
    } else if (data.assetType === 'precious_metal') {
      if (data.metalType) typeMetadata.metal_type = data.metalType
      if (data.troyOzWeight) typeMetadata.troy_oz_weight = parseFloat(data.troyOzWeight)
      if (data.metalPurity) typeMetadata.metal_purity = data.metalPurity
    } else if (data.assetType === 'mineral_rights') {
      if (data.netMineralAcres) typeMetadata.net_mineral_acres = data.netMineralAcres
      if (data.royaltyRate) typeMetadata.royalty_rate = data.royaltyRate
      if (data.countyState) typeMetadata.county_state = data.countyState
    }

    createMutation.mutate({
      name: data.name.trim(),
      assetType: data.assetType,
      valueModel: data.valuePath || undefined,
      holderEntity: data.holderEntity.trim(),
      claimedValue: data.estimatedValue ? parseFloat(data.estimatedValue) : undefined,
      description: data.description.trim() || undefined,
      origin: data.origin?.trim() || undefined,
      caratWeight: data.caratWeight ? parseFloat(data.caratWeight) : undefined,
      ...(Object.keys(typeMetadata).length > 0 ? { metadata: typeMetadata } : {}),
    } as any)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px]">
        <Link href="/crm/assets" className="text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
          Assets
        </Link>
        <ChevronRight className="h-3 w-3 text-[var(--text-muted)]" />
        <span className="font-semibold text-[var(--text-primary)]">New Asset</span>
      </nav>

      {/* Header */}
      <div>
        <h1
          className="text-2xl font-semibold text-[var(--text-primary)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          New Asset
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Add a new real-world asset to the pipeline
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between">
        {STEPS.map((s, idx) => {
          const isCompleted = step > s.num
          const isCurrent = step === s.num
          return (
            <div key={s.num} className="flex items-center flex-1 last:flex-initial">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all',
                    isCompleted
                      ? 'bg-[var(--teal)] text-white shadow-[var(--shadow-raised-sm)]'
                      : isCurrent
                        ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-[var(--shadow-raised-sm)] ring-2 ring-[var(--teal)]'
                        : 'bg-[var(--bg-body)] text-[var(--text-muted)] shadow-[var(--shadow-pressed)]'
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : s.num}
                </div>
                <span
                  className={cn(
                    'text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap',
                    isCurrent ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'
                  )}
                >
                  {s.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-[2px] mx-3 mt-[-18px] rounded-full transition-all',
                    step > s.num ? 'bg-[var(--teal)]' : 'bg-[var(--border)]'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Step Content */}
      <NeuCard variant="raised" padding="lg">
        {step === 1 && (
          <div className="space-y-4">
            <h2
              className="text-lg font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Basic Information
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              Enter the core details about the asset being onboarded.
            </p>
            <NeuInput
              label="Asset Name *"
              placeholder="e.g., Emerald Barrel #017093"
              value={data.name}
              onChange={(e) => update({ name: e.target.value })}
              error={data.name.length === 0 && step === 1 ? undefined : undefined}
            />
            <NeuSelect
              label="Asset Type"
              value={data.assetType}
              onChange={(e) => update({ assetType: e.target.value as AssetType })}
              options={ASSET_TYPE_OPTIONS}
            />
            <NeuInput
              label="Holder Entity *"
              placeholder="e.g., Kandi International LLC"
              value={data.holderEntity}
              onChange={(e) => update({ holderEntity: e.target.value })}
            />
            <NeuTextarea
              label="Description"
              placeholder="Optional notes about this asset..."
              value={data.description}
              onChange={(e) => update({ description: e.target.value })}
              rows={3}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2
              className="text-lg font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Value Path
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              Select the value realization path for this asset. This can be changed later as due diligence progresses.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {VALUE_PATHS.map((path) => {
                const isSelected = data.valuePath === path.id
                return (
                  <button
                    key={path.id}
                    type="button"
                    onClick={() => update({ valuePath: path.id })}
                    className={cn(
                      'text-left rounded-[var(--radius-lg)] p-4 transition-all',
                      'focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]',
                      isSelected
                        ? 'shadow-[var(--shadow-raised-sm)] ring-2'
                        : 'shadow-[var(--shadow-pressed)] hover:shadow-[var(--shadow-raised-sm)]'
                    )}
                    style={{
                      backgroundColor: isSelected ? path.bgVar : undefined,
                      borderColor: isSelected ? path.color : undefined,
                      ...(isSelected ? { outline: `2px solid ${path.color}`, outlineOffset: '-2px' } : {}),
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: path.color }}
                      />
                      <span className="text-sm font-semibold text-[var(--text-primary)]">
                        {path.label}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {path.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2
              className="text-lg font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Valuation &amp; Details
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              Provide initial valuation data and key details for this {data.assetType.replace(/_/g, ' ')}.
            </p>
            <NeuInput
              label="Estimated Value (USD)"
              placeholder="e.g., 15400000"
              type="number"
              value={data.estimatedValue}
              onChange={(e) => update({ estimatedValue: e.target.value })}
              helperText="Claimed or appraised value"
            />

            {/* Asset-type-specific fields */}
            {data.assetType === 'gemstone' && (
              <>
                <NeuInput label="Origin" placeholder="e.g., Muzo Mine, Colombia" value={data.origin}
                  onChange={(e) => update({ origin: e.target.value })} helperText="Geographic origin / provenance" />
                <div className="grid grid-cols-2 gap-3">
                  <NeuInput label="Carat Weight" type="number" placeholder="e.g., 45.2"
                    value={String((data as Record<string, unknown>).caratWeight ?? '')}
                    onChange={(e) => update({ caratWeight: e.target.value } as Partial<WizardData>)} />
                  <NeuInput label="GIA Report #" placeholder="e.g., 1234567890"
                    value={String((data as Record<string, unknown>).giaReport ?? '')}
                    onChange={(e) => update({ giaReport: e.target.value } as Partial<WizardData>)} />
                </div>
              </>
            )}

            {data.assetType === 'real_estate' && (
              <>
                <NeuInput label="Property Address" placeholder="123 Main St, City, State ZIP"
                  value={String((data as Record<string, unknown>).propertyAddress ?? '')}
                  onChange={(e) => update({ propertyAddress: e.target.value } as Partial<WizardData>)} />
                <div className="grid grid-cols-2 gap-3">
                  <NeuInput label="Property Type" placeholder="e.g., Commercial, Residential"
                    value={String((data as Record<string, unknown>).propertyType ?? '')}
                    onChange={(e) => update({ propertyType: e.target.value } as Partial<WizardData>)} />
                  <NeuInput label="Square Footage" type="number" placeholder="e.g., 2500"
                    value={String((data as Record<string, unknown>).sqFootage ?? '')}
                    onChange={(e) => update({ sqFootage: e.target.value } as Partial<WizardData>)} />
                </div>
              </>
            )}

            {data.assetType === 'precious_metal' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <NeuInput label="Metal Type" placeholder="e.g., Gold, Silver, Platinum"
                    value={String((data as Record<string, unknown>).metalType ?? '')}
                    onChange={(e) => update({ metalType: e.target.value } as Partial<WizardData>)} />
                  <NeuInput label="Weight (Troy oz)" type="number" placeholder="e.g., 100"
                    value={String((data as Record<string, unknown>).troyOzWeight ?? '')}
                    onChange={(e) => update({ troyOzWeight: e.target.value } as Partial<WizardData>)} />
                </div>
                <NeuInput label="Purity / Fineness" placeholder="e.g., 999.9 (24K)"
                  value={String((data as Record<string, unknown>).metalPurity ?? '')}
                  onChange={(e) => update({ metalPurity: e.target.value } as Partial<WizardData>)} />
              </>
            )}

            {data.assetType === 'mineral_rights' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <NeuInput label="Net Mineral Acres" type="number" placeholder="e.g., 640"
                    value={String((data as Record<string, unknown>).netMineralAcres ?? '')}
                    onChange={(e) => update({ netMineralAcres: e.target.value } as Partial<WizardData>)} />
                  <NeuInput label="Royalty Rate (%)" placeholder="e.g., 12.5"
                    value={String((data as Record<string, unknown>).royaltyRate ?? '')}
                    onChange={(e) => update({ royaltyRate: e.target.value } as Partial<WizardData>)} />
                </div>
                <NeuInput label="County / State" placeholder="e.g., Midland County, TX"
                  value={String((data as Record<string, unknown>).countyState ?? '')}
                  onChange={(e) => update({ countyState: e.target.value } as Partial<WizardData>)} />
              </>
            )}

            {data.assetType === 'other' && (
              <NeuInput label="Origin / Source" placeholder="Source or provenance description" value={data.origin}
                onChange={(e) => update({ origin: e.target.value })} />
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <h2
              className="text-lg font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Review
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              Confirm the details below and create the asset.
            </p>

            <div className="space-y-3">
              {/* Basic Info */}
              <NeuCard variant="pressed" padding="md">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                  Basic Information
                </h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-[var(--text-muted)]">Name</dt>
                    <dd className="text-[var(--text-primary)] font-semibold">{data.name || '---'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[var(--text-muted)]">Type</dt>
                    <dd className="text-[var(--text-primary)] flex items-center gap-1.5">
                      {ASSET_TYPE_ICONS[data.assetType]}
                      {ASSET_TYPE_OPTIONS.find((o) => o.value === data.assetType)?.label}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[var(--text-muted)]">Holder Entity</dt>
                    <dd className="text-[var(--text-primary)]">{data.holderEntity || '---'}</dd>
                  </div>
                  {data.description && (
                    <div className="flex justify-between">
                      <dt className="text-[var(--text-muted)]">Description</dt>
                      <dd className="text-[var(--text-primary)] text-right max-w-[60%]">{data.description}</dd>
                    </div>
                  )}
                </dl>
              </NeuCard>

              {/* Value Path */}
              <NeuCard variant="pressed" padding="md">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                  Value Path
                </h3>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: VALUE_PATHS.find((p) => p.id === data.valuePath)?.color,
                    }}
                  />
                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    {PATH_LABEL[data.valuePath]}
                  </span>
                </div>
              </NeuCard>

              {/* Valuation */}
              <NeuCard variant="pressed" padding="md">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                  Valuation
                </h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-[var(--text-muted)]">Estimated Value</dt>
                    <dd className="text-[var(--text-primary)] font-semibold">
                      {data.estimatedValue
                        ? new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            maximumFractionDigits: 0,
                          }).format(parseFloat(data.estimatedValue))
                        : 'TBD'}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[var(--text-muted)]">Origin</dt>
                    <dd className="text-[var(--text-primary)]">{data.origin || '---'}</dd>
                  </div>
                </dl>
              </NeuCard>
            </div>

            {createMutation.error && (
              <p className="text-sm text-[var(--ruby)]">{createMutation.error.message}</p>
            )}
          </div>
        )}
      </NeuCard>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-3">
        <NeuButton
          variant="ghost"
          icon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => (step === 1 ? router.push('/crm/assets') : setStep(step - 1))}
        >
          {step === 1 ? 'Cancel' : 'Back'}
        </NeuButton>

        {step < 4 ? (
          <NeuButton
            icon={<ArrowRight className="h-4 w-4" />}
            onClick={() => setStep(step + 1)}
            disabled={!canAdvance()}
          >
            Next
          </NeuButton>
        ) : (
          <NeuButton
            onClick={handleSubmit}
            loading={createMutation.isPending}
            disabled={!data.name.trim() || !data.holderEntity.trim()}
          >
            Create Asset
          </NeuButton>
        )}
      </div>
    </div>
  )
}
