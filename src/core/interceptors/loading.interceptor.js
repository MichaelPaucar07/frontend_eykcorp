import { loadingService } from '@/core/services/ui/loading.service'

// =========================================================
// INTERCEPTOR DE CARGA GLOBAL
// =========================================================
// Cada petición enciende el indicador global de carga hasta que termina.
// Para omitirlo en una petición puntual:
//
//   http.get(url, { skipGlobalLoading: true })

export function registerLoadingInterceptor(http) {
  http.interceptors.request.use((config) => {
    if (!config.skipGlobalLoading) loadingService.start()
    return config
  })

  http.interceptors.response.use(
    (response) => {
      if (!response.config.skipGlobalLoading) loadingService.stop()
      return response
    },
    (error) => {
      if (!error.config?.skipGlobalLoading) loadingService.stop()
      return Promise.reject(error)
    },
  )
}
