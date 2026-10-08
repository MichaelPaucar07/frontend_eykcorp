// =========================================================
// CONFIGURACIÓN POR ENTORNO
// =========================================================
// Vite carga automáticamente el archivo .env que corresponde:
//   npm run dev   -> .env.development
//   npm run build -> .env.production
// Solo las variables con prefijo VITE_ llegan al navegador.

export const environment = {
  production: import.meta.env.PROD,
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:8081',
}
