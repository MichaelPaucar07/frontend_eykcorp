// =========================================================
// MODELO DE DOMINIO: CLIENTE
// =========================================================

/**
 * Cliente tal como lo devuelve el backend (ClienteResponseDTO).
 * @typedef {Object} Cliente
 * @property {number} id
 * @property {string} nombres
 * @property {string} apellidos
 * @property {string} correo
 * @property {string} telefono
 * @property {string} fechaCreacion
 */

/**
 * Datos que se envían al crear/actualizar (ClienteRequestDTO).
 * @typedef {Object} ClienteForm
 * @property {string} nombres
 * @property {string} apellidos
 * @property {string} correo
 * @property {string} telefono
 */

/** @returns {ClienteForm} */
export function emptyClienteForm() {
  return { nombres: '', apellidos: '', correo: '', telefono: '' }
}

/** @param {Cliente} cliente @returns {ClienteForm} */
export function toClienteForm(cliente) {
  const { nombres, apellidos, correo, telefono } = cliente
  return { nombres, apellidos, correo, telefono }
}

// =========================================================
// VALIDACIONES (mismas reglas que el backend)
// =========================================================
// Se validan en el cliente para dar feedback inmediato; el backend vuelve a
// validar siempre, por lo que estas reglas nunca son la única barrera.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[0-9]{7,15}$/

export const CLIENTE_LIMITS = { nombres: 100, apellidos: 100, correo: 150, telefono: 15 }

/**
 * @param {ClienteForm} form
 * @returns {Record<string, string>} errores por campo (vacío si es válido)
 */
export function validateClienteForm(form) {
  const errors = {}
  const nombres = form.nombres.trim()
  const apellidos = form.apellidos.trim()
  const correo = form.correo.trim()
  const telefono = form.telefono.trim()

  if (!nombres) errors.nombres = 'Los nombres son obligatorios'
  else if (nombres.length > CLIENTE_LIMITS.nombres)
    errors.nombres = 'Los nombres no pueden superar los 100 caracteres'

  if (!apellidos) errors.apellidos = 'Los apellidos son obligatorios'
  else if (apellidos.length > CLIENTE_LIMITS.apellidos)
    errors.apellidos = 'Los apellidos no pueden superar los 100 caracteres'

  if (!correo) errors.correo = 'El correo es obligatorio'
  else if (!EMAIL_PATTERN.test(correo)) errors.correo = 'El correo no tiene un formato válido'
  else if (correo.length > CLIENTE_LIMITS.correo)
    errors.correo = 'El correo no puede superar los 150 caracteres'

  if (!telefono) errors.telefono = 'El teléfono es obligatorio'
  else if (!PHONE_PATTERN.test(telefono))
    errors.telefono = 'El teléfono debe contener solo dígitos (entre 7 y 15)'

  return errors
}
