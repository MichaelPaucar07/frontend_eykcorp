// =========================================================
// FORMATEADORES (funciones puras, sin dependencias)
// =========================================================

const dateTimeFormatter = new Intl.DateTimeFormat('es-EC', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

/** "2026-10-08T12:31:17.563" -> "8 oct 2026, 12:31" */
export function formatDateTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : dateTimeFormatter.format(date)
}

/** "Michael", "Paucar" -> "MP" */
export function initials(...names) {
  return names
    .filter(Boolean)
    .map((name) => name.trim().charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
}
