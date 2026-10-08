// =========================================================
// CONTRATOS DE RESPUESTA DEL BACKEND (backend_eykcorp)
// =========================================================
// Todas las respuestas de la API tienen la misma estructura (ApiResponse).
// Se documentan con JSDoc para tener autocompletado en el editor.

/**
 * @template T
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {number} status
 * @property {string} message
 * @property {T | null} data
 * @property {Record<string, string> | null} errors
 * @property {string} timestamp
 */

/**
 * @template T
 * @typedef {Object} PageResponse
 * @property {T[]} content
 * @property {number} page
 * @property {number} size
 * @property {number} totalElements
 * @property {number} totalPages
 * @property {boolean} first
 * @property {boolean} last
 */

/**
 * Error normalizado que reciben los componentes cuando una petición falla.
 * @typedef {Object} ApiError
 * @property {number} status          0 si no hubo respuesta del servidor
 * @property {string} message         mensaje listo para mostrar
 * @property {Record<string, string>} errors  errores por campo (vacío si no hay)
 */

export {}
