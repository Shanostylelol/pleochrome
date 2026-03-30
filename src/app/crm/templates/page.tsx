'use client'

import { useState } from 'react'
import {
  BookOpen, Shield, ChevronDown, ChevronRight, Edit3, Plus, X, Settings,
} from 'lucide-react'
import { NeuCard, NeuBadge, NeuTabs, NeuButton, NeuInput, NeuTextarea, NeuCheckbox } from '@/components/ui'
import { trpc } from '@/lib/trpc'

const TABS = [
  { id: 'requirements', label: 'Requirements' },
  { id: 'modules', label: 'Partner Modules' },
  { id: 'coverage', label: 'Coverage Matrix' },
]

const PHASE_LABELS: Record<string, string> = {
  phase_0_foundation: 'Phase 0 — Foundation',
  phase_1_intake: 'Phase 1 — Intake & Acquisition',
  phase_2_certification: 'Phase 2 — Certification',
  phase_3_custody: 'Phase 3 — Custody',
  phase_4_legal: 'Phase 4 — Legal',
  phase_5_tokenization: 'Phase 5 — Execution',
  phase_6_regulatory: 'Phase 6 — Regulatory',
  phase_7_distribution: 'Phase 7 — Distribution',
  phase_8_ongoing: 'Phase 8 — Ongoing',
}

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState('requirements')
  const [editingReq, setEditingReq] = useState<Record<string, unknown> | null>(null)
  const [showCreateModule, setShowCreateModule] = useState(false)

  const { data: requirements = [], isLoading } = trpc.governance.listRequirements.useQuery()
  const { data: modules = [] } = trpc.governance.listModules.useQuery()
  const { data: partners = [] } = trpc.partners.list.useQuery()

  const grouped: Record<string, typeof requirements> = {}
  requirements.forEach((r) => {
    const label = PHASE_LABELS[r.phase] ?? r.phase ?? 'Other'
    if (!grouped[label]) grouped[label] = []
    grouped[label].push(r)
  })

  const sharedCount = requirements.filter((r) => !r.value_path).length
  const gateCount = requirements.filter((r) => r.is_gate).length

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
            Governance Templates
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {requirements.length} requirements ({sharedCount} shared, {gateCount} gates) across {Object.keys(grouped).length} phases
          </p>
        </div>
        {activeTab === 'modules' && (
          <NeuButton icon={<Plus className="h-4 w-4" />} size="sm" onClick={() => setShowCreateModule(true)}>
            New Module
          </NeuButton>
        )}
      </div>

      <NeuTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'requirements' && (
        isLoading ? (
          <p className="text-[var(--text-muted)] text-center py-10">Loading requirements...</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(grouped).map(([phase, reqs]) => (
              <PhaseGroup key={phase} phase={phase} requirements={reqs} onEdit={setEditingReq} />
            ))}
          </div>
        )
      )}

      {activeTab === 'modules' && (
        <ModulesTab modules={modules} partners={partners} requirements={requirements} />
      )}

      {activeTab === 'coverage' && (
        <CoverageMatrix requirements={requirements} modules={modules} />
      )}

      {editingReq && (
        <EditRequirementModal requirement={editingReq} onClose={() => setEditingReq(null)} />
      )}

      {showCreateModule && (
        <CreateModuleModal partners={partners} onClose={() => setShowCreateModule(false)} />
      )}
    </div>
  )
}

function PhaseGroup({ phase, requirements, onEdit }: {
  phase: string
  requirements: Array<Record<string, unknown>>
  onEdit: (req: Record<string, unknown>) => void
}) {
  const [expanded, setExpanded] = useState(true)
  const gateCount = requirements.filter((r) => r.is_gate).length

  return (
    <NeuCard variant="raised" padding="none">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-[var(--bg-elevated)] transition-colors rounded-t-[var(--radius-md)]"
      >
        {expanded ? <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" /> : <ChevronRight className="h-4 w-4 text-[var(--text-muted)]" />}
        <span className="text-sm font-semibold text-[var(--text-primary)] flex-1">{phase}</span>
        <span className="text-xs text-[var(--text-muted)]">{requirements.length} steps</span>
        {gateCount > 0 && <NeuBadge color="amber" size="sm">{gateCount} gates</NeuBadge>}
      </button>
      {expanded && (
        <div className="px-4 pb-3 space-y-1.5">
          {requirements.map((r) => (
            <button
              key={r.id as string}
              onClick={() => onEdit(r)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)] w-full text-left hover:bg-[var(--bg-elevated)] transition-colors group"
            >
              {r.is_gate ? (
                <Shield className="h-4 w-4 text-[var(--amber)] shrink-0" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--text-primary)] truncate">
                  <span className="text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-mono)' }}>{r.step_number as string}</span>{' '}
                  {r.title as string}
                </p>
                {(r.regulatory_citation as string) && (
                  <p className="text-[10px] text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-mono)' }}>
                    {r.regulatory_citation as string}
                  </p>
                )}
              </div>
              {(r.value_path as string | null) && (
                <NeuBadge
                  color={(r.value_path as string) === 'tokenization' ? 'teal' : (r.value_path as string) === 'fractional_securities' ? 'emerald' : 'sapphire'}
                  size="sm"
                >
                  {(r.value_path as string) === 'fractional_securities' ? 'Frac' : (r.value_path as string) === 'tokenization' ? 'Token' : 'Debt'}
                </NeuBadge>
              )}
              <Edit3 className="h-3.5 w-3.5 text-[var(--text-placeholder)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </button>
          ))}
        </div>
      )}
    </NeuCard>
  )
}

function EditRequirementModal({ requirement, onClose }: { requirement: Record<string, unknown>; onClose: () => void }) {
  const [title, setTitle] = useState((requirement.title as string) ?? '')
  const [description, setDescription] = useState((requirement.description as string) ?? '')
  const [regulatoryBasis, setRegulatoryBasis] = useState((requirement.regulatory_basis as string) ?? '')
  const [regulatoryCitation, setRegulatoryCitation] = useState((requirement.regulatory_citation as string) ?? '')
  const [isGate, setIsGate] = useState((requirement.is_gate as boolean) ?? false)

  const utils = trpc.useUtils()
  const updateMutation = trpc.governance.updateRequirement.useMutation({
    onSuccess: () => {
      utils.governance.listRequirements.invalidate()
      onClose()
    },
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[var(--overlay)]" onClick={onClose} />
      <NeuCard variant="raised" padding="lg" className="relative w-full max-w-lg z-10 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>Edit Requirement</h2>
            <p className="text-xs text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-mono)' }}>{requirement.step_number as string}</p>
          </div>
          <button onClick={onClose} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"><X className="h-5 w-5" /></button>
        </div>

        <div className="space-y-3">
          <NeuInput label="Title *" value={title} onChange={(e) => setTitle(e.target.value)} />
          <NeuTextarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          <NeuInput label="Regulatory Basis" placeholder="e.g., SEC Regulation D" value={regulatoryBasis} onChange={(e) => setRegulatoryBasis(e.target.value)} />
          <NeuInput label="Regulatory Citation" placeholder="e.g., §506(c)(2)(ii)" value={regulatoryCitation} onChange={(e) => setRegulatoryCitation(e.target.value)} />
          <NeuCheckbox label="This is a gate milestone" checked={isGate} onChange={setIsGate} />
        </div>

        <div className="flex items-center gap-2 p-3 rounded-[var(--radius-md)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)]">
          <Shield className="h-4 w-4 text-[var(--amber)] shrink-0" />
          <p className="text-xs text-[var(--text-muted)]">
            Changes to requirements affect all NEW assets. Existing assets retain their current workflow.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <NeuButton variant="ghost" onClick={onClose} fullWidth>Cancel</NeuButton>
          <NeuButton
            onClick={() => updateMutation.mutate({
              requirementId: requirement.id as string,
              title: title.trim() || undefined,
              description: description.trim() || undefined,
              regulatoryBasis: regulatoryBasis.trim() || undefined,
              regulatoryCitation: regulatoryCitation.trim() || undefined,
              isGate,
            })}
            loading={updateMutation.isPending}
            disabled={!title.trim()}
            fullWidth
          >
            Save Changes
          </NeuButton>
        </div>
        {updateMutation.error && <p className="text-sm text-[var(--ruby)]">{updateMutation.error.message}</p>}
      </NeuCard>
    </div>
  )
}

function ModulesTab({ modules, partners, requirements }: {
  modules: Array<Record<string, unknown>>
  partners: Array<Record<string, unknown>>
  requirements: Array<Record<string, unknown>>
}) {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)

  if (modules.length === 0) {
    return (
      <NeuCard variant="pressed" padding="lg" className="text-center">
        <BookOpen className="h-12 w-12 text-[var(--text-placeholder)] mx-auto mb-3" />
        <p className="text-sm text-[var(--text-muted)]">No partner modules configured</p>
        <p className="text-xs text-[var(--text-placeholder)] mt-1">Create a module to define partner-specific tasks for governance steps</p>
      </NeuCard>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((m) => {
          const isSelected = selectedModule === (m.id as string)
          return (
            <NeuCard
              key={m.id as string}
              variant={isSelected ? 'pressed' : 'raised'}
              padding="md"
              hoverable
              className="cursor-pointer"
              onClick={() => setSelectedModule(isSelected ? null : (m.id as string))}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">{m.module_name as string}</h3>
                <NeuBadge color="amethyst" size="sm">
                  {(m.partners as { name: string } | null)?.name ?? 'Unlinked'}
                </NeuBadge>
              </div>
              {(m.description as string | null) && (
                <p className="text-xs text-[var(--text-muted)]">{String(m.description)}</p>
              )}
              {(m.covers_functions as string[] | null)?.length ? (
                <div className="flex flex-wrap gap-1 mt-2">
                  {(m.covers_functions as string[]).map((fn) => (
                    <NeuBadge key={fn} color="gray" size="sm">{fn}</NeuBadge>
                  ))}
                </div>
              ) : null}
            </NeuCard>
          )
        })}
      </div>

      {selectedModule && (
        <ModuleTasksPanel moduleId={selectedModule} requirements={requirements} />
      )}
    </div>
  )
}

function ModuleTasksPanel({ moduleId, requirements }: { moduleId: string; requirements: Array<Record<string, unknown>> }) {
  const [showAddTask, setShowAddTask] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const [taskType, setTaskType] = useState<'action' | 'upload' | 'review' | 'approval' | 'automated'>('action')
  const [reqId, setReqId] = useState('')

  const { data: tasks = [], isLoading } = trpc.governance.listModuleTasks.useQuery({ partnerModuleId: moduleId })
  const utils = trpc.useUtils()
  const createTask = trpc.governance.createModuleTask.useMutation({
    onSuccess: () => {
      utils.governance.listModuleTasks.invalidate({ partnerModuleId: moduleId })
      setShowAddTask(false)
      setTaskTitle('')
      setTaskDesc('')
      setReqId('')
    },
  })

  return (
    <NeuCard variant="raised" padding="md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Module Tasks</h3>
        <NeuButton size="sm" icon={<Plus className="h-3.5 w-3.5" />} onClick={() => setShowAddTask(!showAddTask)}>
          Add Task
        </NeuButton>
      </div>

      {showAddTask && (
        <NeuCard variant="pressed" padding="md" className="mb-3 space-y-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Governance Requirement *</label>
            <select
              value={reqId}
              onChange={(e) => setReqId(e.target.value)}
              className="h-11 rounded-[var(--radius-md)] border px-3 text-sm bg-[var(--bg-input)] text-[var(--text-primary)] shadow-[var(--shadow-pressed)] border-[var(--border)] focus:outline-none focus:border-[var(--teal)]"
            >
              <option value="">Select requirement...</option>
              {requirements.map((r) => (
                <option key={r.id as string} value={r.id as string}>
                  {r.step_number as string} — {r.title as string}
                </option>
              ))}
            </select>
          </div>
          <NeuInput label="Task Title *" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="e.g., Submit Form D filing" />
          <NeuTextarea label="Description" value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} rows={2} placeholder="What needs to be done..." />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Task Type</label>
            <select
              value={taskType}
              onChange={(e) => setTaskType(e.target.value as typeof taskType)}
              className="h-11 rounded-[var(--radius-md)] border px-3 text-sm bg-[var(--bg-input)] text-[var(--text-primary)] shadow-[var(--shadow-pressed)] border-[var(--border)] focus:outline-none focus:border-[var(--teal)]"
            >
              <option value="action">Action</option>
              <option value="upload">Upload</option>
              <option value="review">Review</option>
              <option value="approval">Approval</option>
              <option value="automated">Automated</option>
            </select>
          </div>
          <div className="flex gap-2 pt-1">
            <NeuButton variant="ghost" size="sm" onClick={() => setShowAddTask(false)}>Cancel</NeuButton>
            <NeuButton
              size="sm"
              onClick={() => createTask.mutate({
                partnerModuleId: moduleId,
                governanceRequirementId: reqId,
                taskTitle: taskTitle.trim(),
                taskDescription: taskDesc.trim() || undefined,
                taskType,
              })}
              loading={createTask.isPending}
              disabled={!taskTitle.trim() || !reqId}
            >
              Create Task
            </NeuButton>
          </div>
          {createTask.error && <p className="text-xs text-[var(--ruby)]">{createTask.error.message}</p>}
        </NeuCard>
      )}

      {isLoading ? (
        <p className="text-sm text-[var(--text-muted)] text-center py-4">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)] text-center py-4">No tasks mapped to this module yet</p>
      ) : (
        <div className="space-y-2">
          {tasks.map((t) => (
            <div key={t.id} className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--bg-body)] shadow-[var(--shadow-pressed)]">
              <NeuBadge color="teal" size="sm">{t.task_type}</NeuBadge>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--text-primary)] truncate">{t.task_title}</p>
                {t.task_description && <p className="text-xs text-[var(--text-muted)] truncate">{t.task_description}</p>}
              </div>
              {t.replaces_default && <NeuBadge color="amber" size="sm">Replaces default</NeuBadge>}
            </div>
          ))}
        </div>
      )}
    </NeuCard>
  )
}

function CreateModuleModal({ partners, onClose }: { partners: Array<Record<string, unknown>>; onClose: () => void }) {
  const [partnerId, setPartnerId] = useState('')
  const [moduleName, setModuleName] = useState('')
  const [description, setDescription] = useState('')
  const [functions, setFunctions] = useState('')

  const utils = trpc.useUtils()
  const createMutation = trpc.governance.createModule.useMutation({
    onSuccess: () => {
      utils.governance.listModules.invalidate()
      onClose()
    },
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[var(--overlay)]" onClick={onClose} />
      <NeuCard variant="raised" padding="lg" className="relative w-full max-w-md z-10 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>Create Partner Module</h2>
          <button onClick={onClose} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"><X className="h-5 w-5" /></button>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Partner *</label>
            <select
              value={partnerId}
              onChange={(e) => setPartnerId(e.target.value)}
              className="h-11 rounded-[var(--radius-md)] border px-3 text-sm bg-[var(--bg-input)] text-[var(--text-primary)] shadow-[var(--shadow-pressed)] border-[var(--border)] focus:outline-none focus:border-[var(--teal)]"
            >
              <option value="">Select partner...</option>
              {partners.map((p) => (
                <option key={p.id as string} value={p.id as string}>{p.name as string}</option>
              ))}
            </select>
          </div>
          <NeuInput label="Module Name *" value={moduleName} onChange={(e) => setModuleName(e.target.value)} placeholder="e.g., Rialto BD Services" />
          <NeuTextarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="What this module covers..." />
          <NeuInput label="Functions Covered" value={functions} onChange={(e) => setFunctions(e.target.value)} placeholder="e.g., broker_dealer, ats, compliance (comma-separated)" />
        </div>

        <div className="flex gap-3 pt-2">
          <NeuButton variant="ghost" onClick={onClose} fullWidth>Cancel</NeuButton>
          <NeuButton
            onClick={() => createMutation.mutate({
              partnerId,
              moduleName: moduleName.trim(),
              description: description.trim() || undefined,
              coversFunctions: functions.split(',').map((s) => s.trim()).filter(Boolean),
            })}
            loading={createMutation.isPending}
            disabled={!partnerId || !moduleName.trim()}
            fullWidth
          >
            Create Module
          </NeuButton>
        </div>
        {createMutation.error && <p className="text-sm text-[var(--ruby)]">{createMutation.error.message}</p>}
      </NeuCard>
    </div>
  )
}

function CoverageMatrix({ requirements, modules }: {
  requirements: Array<Record<string, unknown>>
  modules: Array<Record<string, unknown>>
}) {
  if (modules.length === 0) {
    return (
      <NeuCard variant="pressed" padding="lg" className="text-center">
        <Settings className="h-12 w-12 text-[var(--text-placeholder)] mx-auto mb-3" />
        <p className="text-sm text-[var(--text-muted)]">Create partner modules to see coverage matrix</p>
      </NeuCard>
    )
  }

  const gateReqs = requirements.filter((r) => r.is_gate)
  const nonGateReqs = requirements.filter((r) => !r.is_gate)
  const coveredCount = 0 // would need module_tasks data to calculate

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <NeuCard variant="raised-sm" padding="sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Requirements</p>
          <p className="text-lg font-bold text-[var(--text-primary)]">{requirements.length}</p>
        </NeuCard>
        <NeuCard variant="raised-sm" padding="sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Gates</p>
          <p className="text-lg font-bold text-[var(--amber)]">{gateReqs.length}</p>
        </NeuCard>
        <NeuCard variant="raised-sm" padding="sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Modules</p>
          <p className="text-lg font-bold text-[var(--amethyst)]">{modules.length}</p>
        </NeuCard>
        <NeuCard variant="raised-sm" padding="sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Steps</p>
          <p className="text-lg font-bold text-[var(--text-primary)]">{nonGateReqs.length}</p>
        </NeuCard>
      </div>

      <NeuCard variant="raised" padding="md">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Requirement Coverage</h3>
        <p className="text-xs text-[var(--text-muted)] mb-3">
          Click on a partner module above to see its tasks, then map tasks to governance requirements.
          Each requirement can have default tasks and/or partner-specific tasks from modules.
        </p>
        <div className="space-y-1">
          {Object.entries(PHASE_LABELS).map(([phase, label]) => {
            const phaseReqs = requirements.filter((r) => r.phase === phase)
            if (phaseReqs.length === 0) return null
            return (
              <div key={phase} className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-body)]">
                <span className="text-xs font-medium text-[var(--text-secondary)] w-40 truncate">{label}</span>
                <div className="flex-1 flex gap-0.5">
                  {phaseReqs.map((r) => (
                    <div
                      key={r.id as string}
                      className={`h-4 flex-1 rounded-sm ${r.is_gate ? 'bg-[var(--amber)]' : 'bg-[var(--teal-bg)]'}`}
                      title={`${r.step_number} — ${r.title}`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-[var(--text-muted)] w-8 text-right">{phaseReqs.length}</span>
              </div>
            )
          })}
        </div>
      </NeuCard>
    </div>
  )
}
