import { notifyService } from '@/core/services/ui/notify.service'

// =========================================================
// OPCIONES POR PETICIÓN
// =========================================================
/*
 * Por defecto TODA petición que falle muestra un toast de error
 * automáticamente. Para que un componente maneje su propio mensaje:
 *
 *   http.post(url, body, skipErrorNotify())
 *
 * El éxito NO se notifica automáticamente (no todo GET merece un toast).
 * Se activa explícitamente por petición:
 *
 *   http.post(url, body, notifySuccess())                    // usa el "message" del backend
 *   http.post(url, body, notifySuccess('Cliente creado.'))   // mensaje propio
 */
export function skipErrorNotify(config = {}) {
  return { ...config, skipErrorNotify: true }
}

export function notifySuccess(message, config = {}) {
  return { ...config, notifySuccess: message ?? true }
}

// =========================================================
// NORMALIZACIÓN DE ERRORES
// =========================================================

const FALLBACK_MESSAGES = {
  0: 'No hay conexión con el servidor. Intenta de nuevo.',
  400: 'Revisa los datos ingresados e intenta de nuevo.',
  404: 'No se encontró la información solicitada.',
  409: 'La operación entra en conflicto con el estado actual.',
  500: 'Error del servidor. Intenta más tarde.',
}

/**
 * Convierte un error de Axios en un ApiError uniforme.
 * El backend responde con ApiResponse: { success, status, message, errors, ... }
 * @returns {import('@/core/models/api-response').ApiError}
 */
export function toApiError(error) {
  const status = error.response?.status ?? 0
  const body = error.response?.data

  const message =
    (typeof body?.message === 'string' && body.message) ||
    FALLBACK_MESSAGES[status] ||
    (status >= 500 ? FALLBACK_MESSAGES[500] : 'No se pudo procesar la solicitud.')

  return { status, message, errors: body?.errors ?? {} }
}

// =========================================================
// INTERCEPTOR
// =========================================================

export function registerNotifyInterceptor(http) {
  http.interceptors.response.use(
    (response) => {
      const successConfig = response.config.notifySuccess
      if (successConfig) {
        const message =
          typeof successConfig === 'string'
            ? successConfig
            : response.data?.message || 'Operación realizada correctamente.'
        notifyService.success(message)
      }
      return response
    },
    (error) => {
      const apiError = toApiError(error)
      if (!error.config?.skipErrorNotify) notifyService.error(apiError.message)
      // Los componentes reciben siempre el error ya normalizado
      return Promise.reject(apiError)
    },
  )
}
