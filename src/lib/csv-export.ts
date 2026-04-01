export function exportCSV(
  filename: string,
  columns: { key: string; label: string }[],
  rows: Record<string, unknown>[]
) {
  const header = columns.map(c => `"${c.label}"`).join(',')
  const csvRows = rows.map(row =>
    columns.map(c => {
      const val = row[c.key]
      if (val == null) return '""'
      return `"${String(val).replace(/"/g, '""')}"`
    }).join(',')
  )
  const csv = [header, ...csvRows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
