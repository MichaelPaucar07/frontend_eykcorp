import { DEFAULT_PHONE_COUNTRY, findCountry, parsePhone, toE164 } from '@/shared/utils/phone'

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
 * @property {string} telefono   formato E.164, ej. +593991234567
 * @property {string} fechaCreacion
 */

/**
 * Estado del formulario. El teléfono se edita separado en país + número nacional.
 * @typedef {Object} ClienteForm
 * @property {string} nombres
 * @property {string} apellidos
 * @property {string} correo
 * @property {string} telefonoPais     ISO del país, ej. 'EC'
 * @property {string} telefonoNumero   número nacional, ej. '0991234567'
 */

/** @returns {ClienteForm} */
export function emptyClienteForm() {
  return {
    nombres: '',
    apellidos: '',
    correo: '',
    telefonoPais: DEFAULT_PHONE_COUNTRY,
    telefonoNumero: '',
  }
}

/** @param {Cliente} cliente @returns {ClienteForm} */
export function toClienteForm(cliente) {
  const { country, number } = parsePhone(cliente.telefono)
  return {
    nombres: cliente.nombres,
    apellidos: cliente.apellidos,
    correo: cliente.correo,
    telefonoPais: country,
    telefonoNumero: number,
  }
}

/** Convierte el formulario al cuerpo que espera el backend (ClienteRequestDTO). */
export function toClientePayload(form) {
  return {
    nombres: normalizeText(form.nombres),
    apellidos: normalizeText(form.apellidos),
    correo: form.correo.trim().toLowerCase(),
    telefono: toE164(form.telefonoPais, form.telefonoNumero),
  }
}

// =========================================================
// VALIDACIONES (mismas reglas que el backend)
// =========================================================
// Se validan en el cliente para dar feedback inmediato; el backend vuelve a
// validar siempre, por lo que estas reglas nunca son la única barrera.

// Solo letras (con tildes y ñ), separadas por un espacio, apóstrofo o guion
const NOMBRE_PATTERN = /^\p{L}+(?:[ '-]\p{L}+)*$/u
const CORREO_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

export const CLIENTE_LIMITS = { nombres: 100, apellidos: 100, correo: 150 }

function normalizeText(value) {
  return value.trim().replace(/\s+/g, ' ')
}

function validateNombre(value, label) {
  if (!value) return `Los ${label} son obligatorios`
  if (value.length < 2 || value.length > 100)
    return `Los ${label} deben tener entre 2 y 100 caracteres`
  if (!NOMBRE_PATTERN.test(value)) return `Los ${label} solo pueden contener letras`
  return ''
}

/**
 * @param {ClienteForm} form
 * @returns {Record<string, string>} errores por campo (vacío si es válido)
 */
export function validateClienteForm(form) {
  const errors = {}
  const nombres = normalizeText(form.nombres)
  const apellidos = normalizeText(form.apellidos)
  const correo = form.correo.trim()
  const country = findCountry(form.telefonoPais)

  const nombresError = validateNombre(nombres, 'nombres')
  if (nombresError) errors.nombres = nombresError

  const apellidosError = validateNombre(apellidos, 'apellidos')
  if (apellidosError) errors.apellidos = apellidosError

  if (!correo) errors.correo = 'El correo es obligatorio'
  else if (!CORREO_PATTERN.test(correo)) errors.correo = 'El correo no tiene un formato válido'
  else if (correo.length > CLIENTE_LIMITS.correo)
    errors.correo = 'El correo no puede superar los 150 caracteres'

  if (!form.telefonoNumero) errors.telefono = 'El teléfono es obligatorio'
  else if (!country.pattern.test(form.telefonoNumero))
    errors.telefono = `Número de ${country.name} inválido: ${country.digits} dígitos, ej. ${country.example}`

  return errors
}
