// =========================================================
// TELÉFONOS CON CÓDIGO DE PAÍS (formato internacional E.164)
// =========================================================
// El backend guarda el teléfono como "+<código><número>", ej. +593991234567.
// En el formulario se pide el número en formato nacional (como lo escribe
// la gente: 0991234567) y aquí se convierte a/desde E.164.

/**
 * @typedef {Object} PhoneCountry
 * @property {string} iso       código ISO del país
 * @property {string} name
 * @property {string} dial      código de país sin "+"
 * @property {number} digits    dígitos del número nacional
 * @property {RegExp} pattern   formato del número nacional
 * @property {string} example
 * @property {string} [trunk]   prefijo nacional que se omite en E.164 (Ecuador: 0)
 */

/** @type {PhoneCountry[]} */
export const PHONE_COUNTRIES = [
  {
    iso: 'EC',
    name: 'Ecuador',
    dial: '593',
    digits: 10,
    pattern: /^09\d{8}$/,
    example: '0991234567',
    trunk: '0',
  },
  {
    iso: 'CO',
    name: 'Colombia',
    dial: '57',
    digits: 10,
    pattern: /^3\d{9}$/,
    example: '3001234567',
  },
  { iso: 'PE', name: 'Perú', dial: '51', digits: 9, pattern: /^9\d{8}$/, example: '912345678' },
  { iso: 'MX', name: 'México', dial: '52', digits: 10, pattern: /^\d{10}$/, example: '5512345678' },
  {
    iso: 'US',
    name: 'Estados Unidos',
    dial: '1',
    digits: 10,
    pattern: /^[2-9]\d{9}$/,
    example: '2025550123',
  },
  {
    iso: 'ES',
    name: 'España',
    dial: '34',
    digits: 9,
    pattern: /^[67]\d{8}$/,
    example: '612345678',
  },
]

export const DEFAULT_PHONE_COUNTRY = 'EC'

export function findCountry(iso) {
  return PHONE_COUNTRIES.find((country) => country.iso === iso) ?? PHONE_COUNTRIES[0]
}

/** "EC", "0991234567" -> "+593991234567" */
export function toE164(iso, nationalNumber) {
  const country = findCountry(iso)
  const digits = nationalNumber.replace(/\D/g, '')
  const subscriber =
    country.trunk && digits.startsWith(country.trunk) ? digits.slice(country.trunk.length) : digits
  return `+${country.dial}${subscriber}`
}

/**
 * "+593991234567" -> { country: 'EC', number: '0991234567' }
 * Un valor sin "+" se interpreta como número nacional del país por defecto.
 */
export function parsePhone(value) {
  const clean = (value ?? '').replace(/[\s\-()]/g, '')
  if (!clean.startsWith('+')) {
    return { country: DEFAULT_PHONE_COUNTRY, number: clean.replace(/\D/g, '') }
  }

  // Coincidencia por el código de país más largo (evita confundir +1 con +12...)
  const digits = clean.slice(1)
  const country = [...PHONE_COUNTRIES]
    .sort((a, b) => b.dial.length - a.dial.length)
    .find((c) => digits.startsWith(c.dial))

  if (!country) return { country: DEFAULT_PHONE_COUNTRY, number: digits }

  const subscriber = digits.slice(country.dial.length)
  return { country: country.iso, number: (country.trunk ?? '') + subscriber }
}

/** "+593991234567" -> "+593 991234567" (separa el código de país, solo para mostrar) */
export function formatPhone(value) {
  if (!value) return '—'
  if (!value.startsWith('+')) return value
  const country = [...PHONE_COUNTRIES]
    .sort((a, b) => b.dial.length - a.dial.length)
    .find((c) => value.slice(1).startsWith(c.dial))
  return country ? `+${country.dial} ${value.slice(1 + country.dial.length)}` : value
}
