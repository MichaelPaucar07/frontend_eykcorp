import { http } from '@/core/http/http.client'
import { notifySuccess } from '@/core/interceptors/notify.interceptor'

// =========================================================
// SERVICIO HTTP DE CLIENTES
// =========================================================
// Servicio SIN estado: solo envuelve las llamadas a /clientes.
// El estado (lista, carga, errores) vive en el componente que lo usa.
// Todas las funciones devuelven el campo "data" del ApiResponse.

const RESOURCE = '/clientes'

export const clienteService = {
  /**
   * @returns {Promise<import('@/core/models/api-response').PageResponse<import('../models/cliente').Cliente>>}
   */
  async listar(page = 0, size = 10) {
    const { data } = await http.get(RESOURCE, { params: { page, size } })
    return data.data
  },

  async obtenerPorId(id) {
    const { data } = await http.get(`${RESOURCE}/${id}`)
    return data.data
  },

  async crear(cliente) {
    const { data } = await http.post(RESOURCE, cliente, notifySuccess())
    return data.data
  },

  async actualizar(id, cliente) {
    const { data } = await http.put(`${RESOURCE}/${id}`, cliente, notifySuccess())
    return data.data
  },

  async eliminar(id) {
    await http.delete(`${RESOURCE}/${id}`, notifySuccess())
  },
}
