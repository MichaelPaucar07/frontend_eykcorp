import axios from 'axios'

import { registerLoadingInterceptor } from '@/core/interceptors/loading.interceptor'
import { registerNotifyInterceptor } from '@/core/interceptors/notify.interceptor'
import { environment } from '@/environments/environment'

// =========================================================
// CLIENTE HTTP BASE
// =========================================================
// Instancia única de Axios que usan todos los servicios de features.
// La URL base viene del environment (VITE_API_URL).

export const http = axios.create({
  baseURL: environment.apiUrl,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// El orden importa: loading se registra primero para que el indicador se
// apague antes de que el notify transforme el error en un ApiError.
registerLoadingInterceptor(http)
registerNotifyInterceptor(http)
