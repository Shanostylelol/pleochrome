'use client'

import { useState } from 'react'
import { BookOpen, Plus, X } from 'lucide-react'
import { NeuCard, NeuBadge, NeuButton, NeuInput, NeuTextarea, NeuSelect, NeuModal } from '@/components/ui'
import { VALUE_MODELS, type ValueModelKey } from '@/lib/constants'
import { trpc } from '@/lib/trpc'
import { TemplateEditor } from '@/components/crm/TemplateEditor'
import { ListPageSkeleton } from '@/components/crm/skeletons'

const VALUE_MODEL_OPTS = [
  { value: '', label: 'All Models' },
  ...Object.entries(VALUE_MODELS).map(([key, cfg]) => ({ value: key, label: cfg.label })),
]

const vmBadgeColor: Record<string, 'emerald' | 'teal' | 'sapphire' | 'amber' | 'amethyst' | 'gray'> = {
  tokenization: 'teal',
  fractional_securities: 'emerald',
  debt_instrument: 'sapphire',
  broker_sale: 'amber',
  barter: 'amethyst',
}

export default function TemplatesPage() {
  const [filterModel, setFilterModel] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const { data: templates = [], isLoading } = trpc.templates.list.useQuery(
    filterModel ? { valueModel: filterModel } : undefined,
  )

  const { data: templateDetail } = trpc.templates.getById.useQuery(
    { templateId: selectedId! },
    { enabled: !!selectedId },
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-semibold text-[var(--text-primary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Templates
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {templates.length} template{templates.length !== 1 ? 's' : ''}
          </p>
        </div>
        <NeuButton icon={<Plus className="h-4 w-4" />} onClick={() => setShowCreate(true)}>
          <span className="hidden sm:inline">Create Template</span>
        </NeuButton>
      </div>

      {/* Filter */}
      <div className="max-w-xs">
        <NeuSelect
          value={filterModel}
          onChange={(e) => setFilterModel(e.target.value)}
          options={VALUE_MODEL_OPTS}
          label="Filter by Value Model"
        />
      </div>

      {/* Template grid */}
      {isLoading ? (
        <ListPageSkeleton />
      ) : templates.length === 0 ? (
        <NeuCard variant="pressed" padding="lg" className="text-center">
          <BookOpen className="h-12 w-12 text-[var(--text-placeholder)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">No templates found</p>
          <p className="text-xs text-[var(--text-placeholder)] mt-1">
            Create a template to define reusable workflows
          </p>
        </NeuCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {templates.map((tmpl: any) => (
            <TemplateCard
              key={tmpl.id}
              template={tmpl}
              isSelected={selectedId === tmpl.id}
              onClick={() => setSelectedId(selectedId === tmpl.id ? null : tmpl.id)}
            />
          ))}
        </div>
      )}

      {/* Editor panel */}
      {selectedId && templateDetail && (
        <TemplateEditor data={templateDetail} onClose={() => setSelectedId(null)} />
      )}

      {/* Create modal */}
      <CreateTemplateModal open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  )
}

function TemplateCard({ template, isSelected, onClick }: {
  template: any; isSelected: boolean; onClick: () => void
}) {
  const vm = template.value_model as string | null

  return (
    <NeuCard
      variant={isSelected ? 'pressed' : 'raised'}
      padding="md"
      hoverable
      className="cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] line-clamp-1">
          {template.name}
        </h3>
        {template.is_system && <NeuBadge color="sapphire" size="sm">System</NeuBadge>}
      </div>
      {template.description && (
        <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-3">
          {template.description}
        </p>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        {vm && (
          <NeuBadge color={vmBadgeColor[vm] ?? 'gray'} size="sm">
            {VALUE_MODELS[vm as ValueModelKey]?.label ?? vm}
          </NeuBadge>
        )}
        {(template.asset_type as string | null) && (
          <NeuBadge color="teal" size="sm">
            {(template.asset_type as string).replace(/_/g, ' ')}
          </NeuBadge>
        )}
        {!vm && !(template.asset_type as string | null) && (
          <NeuBadge color="gray" size="sm">Universal</NeuBadge>
        )}
      </div>
    </NeuCard>
  )
}

function CreateTemplateModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [valueModel, setValueModel] = useState('')
  const [assetType, setAssetType] = useState('')
  const utils = trpc.useUtils()

  const mutation = trpc.templates.create.useMutation({
    onSuccess: () => {
      utils.templates.list.invalidate()
      resetAndClose()
    },
  })

  const resetAndClose = () => {
    setName(''); setDescription(''); setValueModel(''); setAssetType('')
    onClose()
  }

  return (
    <NeuModal open={open} onClose={resetAndClose} title="Create Template" maxWidth="md">
      <div className="space-y-3">
        <NeuInput
          label="Template Name *"
          placeholder="e.g., Gemstone Tokenization Workflow"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <NeuTextarea
          label="Description"
          placeholder="Describe this template's purpose..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <div className="grid grid-cols-2 gap-3">
          <NeuSelect
            label="Value Model"
            value={valueModel}
            onChange={(e) => setValueModel(e.target.value)}
            options={[{ value: '', label: 'Universal' }, ...Object.entries(VALUE_MODELS).map(([key, cfg]) => ({
              value: key, label: cfg.label,
            }))]}
          />
          <NeuSelect
            label="Asset Type"
            value={assetType}
            onChange={(e) => setAssetType(e.target.value)}
            options={[
              { value: '', label: 'Universal' },
              { value: 'gemstone', label: 'Gemstone' },
              { value: 'real_estate', label: 'Real Estate' },
              { value: 'precious_metal', label: 'Precious Metal' },
              { value: 'mineral_rights', label: 'Mineral Rights' },
              { value: 'other', label: 'Other' },
            ]}
          />
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <NeuButton variant="ghost" onClick={resetAndClose} fullWidth>Cancel</NeuButton>
        <NeuButton
          onClick={() => mutation.mutate({
            name: name.trim(),
            description: description.trim() || undefined,
            valueModel: valueModel || undefined,
            assetType: assetType || undefined,
          })}
          loading={mutation.isPending}
          disabled={!name.trim()}
          fullWidth
        >
          Create Template
        </NeuButton>
      </div>
      {mutation.error && (
        <p className="text-sm text-[var(--ruby)] mt-2">{mutation.error.message}</p>
      )}
    </NeuModal>
  )
}
