'use client'

import { MessageCircle, Paperclip } from 'lucide-react'
import { SUBTASK_TYPES, type SubtaskTypeKey } from '@/lib/constants'
import { SubtaskFileList } from './SubtaskFileList'
import { SubtaskCommentThread } from './SubtaskCommentThread'
import { TaskDetailSection } from './TaskDetailSection'
import { FileTypeRenderer } from './type-renderers/FileTypeRenderer'
import { CommunicationTypeRenderer } from './type-renderers/CommunicationTypeRenderer'
import { MeetingRenderer } from './type-renderers/MeetingRenderer'
import { ApprovalRenderer } from './type-renderers/ApprovalRenderer'
import { SimpleTypeRenderer } from './type-renderers/SimpleTypeRenderer'
import type { Subtask } from './SubtaskChecklist'

interface SubtaskTypeRendererProps {
  subtask: Subtask
  taskId: string
  assetId?: string
  currentUserId: string
  onUpdate: (subtaskId: string, fields: { title?: string; subtaskType?: string; notes?: string; status?: string }) => void
}

const FILE_TYPES: SubtaskTypeKey[] = ['document_upload', 'verification', 'signature', 'research']
const COMM_TYPES: SubtaskTypeKey[] = ['call', 'email', 'communication']
const SIMPLE_TYPES: SubtaskTypeKey[] = ['note', 'follow_up', 'review', 'filing']

function TypeSpecificForm({ subtask, taskId, assetId, currentUserId, onUpdate }: SubtaskTypeRendererProps) {
  const typeKey = subtask.subtask_type as SubtaskTypeKey | undefined
  if (!typeKey || !(typeKey in SUBTASK_TYPES)) return null

  if (FILE_TYPES.includes(typeKey)) {
    return <FileTypeRenderer subtask={subtask} typeKey={typeKey} taskId={taskId} assetId={assetId} onUpdate={onUpdate} />
  }
  if (COMM_TYPES.includes(typeKey)) {
    return <CommunicationTypeRenderer subtask={subtask} typeKey={typeKey} onUpdate={onUpdate} />
  }
  if (typeKey === 'meeting') {
    return <MeetingRenderer subtask={subtask} taskId={taskId} assetId={assetId} onUpdate={onUpdate} />
  }
  if (typeKey === 'approval') {
    return <ApprovalRenderer subtask={subtask} currentUserId={currentUserId} onUpdate={onUpdate} />
  }
  if (SIMPLE_TYPES.includes(typeKey)) {
    return <SimpleTypeRenderer subtask={subtask} typeKey={typeKey} onUpdate={onUpdate} />
  }
  return null
}

export function SubtaskTypeRenderer(props: SubtaskTypeRendererProps) {
  const { subtask, taskId, assetId, currentUserId } = props
  const typeKey = subtask.subtask_type as SubtaskTypeKey | undefined
  const typeCfg = typeKey && typeKey in SUBTASK_TYPES ? SUBTASK_TYPES[typeKey] : null

  return (
    <div className="ml-2 sm:ml-6 mt-2 mb-2 space-y-3 p-2 sm:p-3 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border)]">
      {/* Type header */}
      {typeCfg && (
        <div className="flex items-center gap-2 pb-2 border-b border-[var(--border)]">
          <span className="w-2 h-2 rounded-full" style={{ background: typeCfg.color }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: typeCfg.color }}>
            {typeCfg.label}
          </span>
        </div>
      )}

      {/* Type-specific form */}
      <TypeSpecificForm {...props} />

      {/* Universal: Files */}
      <TaskDetailSection icon={<Paperclip className="h-3 w-3" />} label="Files">
        <SubtaskFileList subtaskId={subtask.id} taskId={taskId} assetId={assetId} />
      </TaskDetailSection>

      {/* Universal: Comments */}
      <TaskDetailSection icon={<MessageCircle className="h-3 w-3" />} label="Comments">
        <SubtaskCommentThread subtaskId={subtask.id} assetId={assetId} currentUserId={currentUserId} />
      </TaskDetailSection>
    </div>
  )
}
