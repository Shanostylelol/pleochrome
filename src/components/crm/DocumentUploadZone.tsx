'use client'

import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from 'react'
import { Upload, File, X, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NeuCard } from '@/components/ui/NeuCard'
import { NeuProgress } from '@/components/ui/NeuProgress'
import { createClient } from '@/lib/supabase'

// ── Types ─────────────────────────────────────────────────
export interface DocumentUploadZoneProps {
  assetId: string
  stageId?: string
  taskId?: string
  onUploadComplete: (file: UploadedFile) => void
}

export interface UploadedFile {
  name: string
  size: number
  mimeType: string
  url: string
}

// ── Constants ─────────────────────────────────────────────
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB
const ALLOWED_MIME_PREFIXES = [
  'application/pdf',
  'image/',
  'application/vnd.openxmlformats',
  'application/msword',
  'text/',
  'application/json',
]

function isAllowedMime(mime: string): boolean {
  return ALLOWED_MIME_PREFIXES.some((prefix) => mime.startsWith(prefix))
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ── Component ─────────────────────────────────────────────
export function DocumentUploadZone({
  assetId: _assetId,
  stageId: _stageId,
  taskId: _taskId,
  onUploadComplete,
}: DocumentUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback((file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) return `File exceeds 50 MB limit (${formatBytes(file.size)})`
    if (!isAllowedMime(file.type)) return `File type "${file.type || 'unknown'}" is not allowed`
    return null
  }, [])

  const handleFile = useCallback(
    async (file: File) => {
      setError(null)
      setIsComplete(false)
      setProgress(0)

      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        return
      }

      setSelectedFile(file)

      // Upload to Supabase Storage
      const supabase = createClient()
      const folder = _assetId || 'general'
      const path = `${folder}/${Date.now()}-${file.name}`

      // Show progress animation while upload runs
      const progressTimer = setInterval(() => {
        setProgress((prev) => prev >= 90 ? 90 : prev + Math.random() * 15 + 5)
      }, 200)

      try {
        const { error: uploadError } = await supabase.storage.from('documents').upload(path, file)
        clearInterval(progressTimer)

        if (uploadError) {
          setError(uploadError.message)
          setSelectedFile(null)
          setProgress(0)
          return
        }

        setProgress(100)
        setIsComplete(true)
        onUploadComplete({
          name: file.name,
          size: file.size,
          mimeType: file.type,
          url: path,
        })
      } catch (err) {
        clearInterval(progressTimer)
        setError(err instanceof Error ? err.message : 'Upload failed')
        setSelectedFile(null)
        setProgress(0)
      }
    },
    [validateFile, onUploadComplete]
  )

  function onDragOver(e: DragEvent) {
    e.preventDefault()
    setIsDragging(true)
  }

  function onDragLeave(e: DragEvent) {
    e.preventDefault()
    setIsDragging(false)
  }

  function onDrop(e: DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function reset() {
    setSelectedFile(null)
    setProgress(0)
    setError(null)
    setIsComplete(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      {/* Drop zone */}
      {!selectedFile && (
        <NeuCard
          variant="pressed"
          padding="lg"
          className={cn(
            'border-2 border-dashed cursor-pointer transition-all text-center',
            isDragging
              ? 'border-[var(--teal)] bg-[var(--teal-bg)]'
              : 'border-[var(--border)] hover:border-[var(--text-muted)]'
          )}
          onClick={() => inputRef.current?.click()}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <Upload className="h-8 w-8 text-[var(--text-muted)] mx-auto mb-2" />
          <p className="text-sm text-[var(--text-secondary)]">
            Drop files here or click to browse
          </p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            PDF, images, documents up to 50 MB
          </p>
        </NeuCard>
      )}

      {/* File preview + progress */}
      {selectedFile && (
        <NeuCard variant="raised-sm" padding="sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--bg-elevated)]">
              {isComplete ? (
                <CheckCircle className="h-5 w-5 text-[var(--chartreuse)]" />
              ) : (
                <File className="h-5 w-5 text-[var(--text-muted)]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                {selectedFile.name}
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">
                {formatBytes(selectedFile.size)}
              </p>
              {!isComplete && <NeuProgress value={progress} color="teal" size="sm" />}
            </div>
            <button
              onClick={reset}
              className="p-1 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--ruby)] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </NeuCard>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-[var(--ruby)] mt-2">{error}</p>
      )}

      <input ref={inputRef} type="file" className="hidden" onChange={onInputChange} />
    </div>
  )
}
