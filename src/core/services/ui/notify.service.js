import { readonly, ref } from 'vue'

// =========================================================
// NOTIFICACIONES (TOASTS)
// =========================================================
// Uso directo desde componentes para feedback que NO viene de una petición
// HTTP (por ejemplo, validaciones del formulario). Los toasts de HTTP los
// dispara automáticamente el notifyInterceptor.

const DEFAULT_TIMEOUT = 3500

const toasts = ref([])
let nextId = 1

function push(type, message, title) {
  const id = nextId++
  toasts.value.push({ id, type, title, message })
  setTimeout(() => dismiss(id), DEFAULT_TIMEOUT)
}

function dismiss(id) {
  toasts.value = toasts.value.filter((toast) => toast.id !== id)
}

export const notifyService = {
  toasts: readonly(toasts),
  dismiss,

  success: (message, title = 'Éxito') => push('success', message, title),
  error: (message, title = 'Error') => push('error', message, title),
  info: (message, title = 'Info') => push('info', message, title),
  warning: (message, title = 'Atención') => push('warning', message, title),
}
