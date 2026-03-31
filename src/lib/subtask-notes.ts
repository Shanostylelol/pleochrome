// Structured metadata stored in the subtask `notes` field as JSON.
// Backward-compatible: plain text notes parse as { _type: 'text', text: '...' }

export interface SubtaskNotesBase {
  _type: string
  text?: string
}

export interface CallNotes extends SubtaskNotesBase {
  _type: 'call'
  call_to?: string
  duration_min?: number
  outcome?: 'connected' | 'voicemail' | 'no_answer' | 'busy'
  call_date?: string
}

export interface EmailNotes extends SubtaskNotesBase {
  _type: 'email'
  email_to?: string
  email_subject?: string
}

export interface CommunicationNotes extends SubtaskNotesBase {
  _type: 'communication'
  comm_type?: 'email' | 'phone' | 'video_call' | 'in_person' | 'text' | 'other'
  direction?: 'inbound' | 'outbound'
}

export interface VerificationNotes extends SubtaskNotesBase {
  _type: 'verification'
  result?: 'pass' | 'fail' | 'partial' | null
  checklist?: { item: string; checked: boolean }[]
}

export interface SignatureNotes extends SubtaskNotesBase {
  _type: 'signature'
  status?: 'pending' | 'sent' | 'signed' | 'declined'
  signer_name?: string
  signed_date?: string
}

export interface MeetingNotes extends SubtaskNotesBase {
  _type: 'meeting'
  meeting_id?: string
}

export interface FollowUpNotes extends SubtaskNotesBase {
  _type: 'follow_up'
  due_date?: string
  linked_entity?: string
}

export interface ReviewNotes extends SubtaskNotesBase {
  _type: 'review'
  decision?: 'approved' | 'rejected' | 'needs_changes' | null
  decided_at?: string
}

export interface FilingNotes extends SubtaskNotesBase {
  _type: 'filing'
  reference_number?: string
  filing_date?: string
  location?: string
}

export type SubtaskNotes =
  | CallNotes
  | EmailNotes
  | CommunicationNotes
  | VerificationNotes
  | SignatureNotes
  | MeetingNotes
  | FollowUpNotes
  | ReviewNotes
  | FilingNotes
  | SubtaskNotesBase

export function parseSubtaskNotes(raw: string | null | undefined): SubtaskNotesBase & Record<string, unknown> {
  if (!raw) return { _type: 'text', text: '' }
  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && parsed._type) return parsed
    return { _type: 'text', text: raw }
  } catch {
    return { _type: 'text', text: raw }
  }
}

export function serializeSubtaskNotes(notes: SubtaskNotesBase & Record<string, unknown>): string {
  return JSON.stringify(notes)
}
