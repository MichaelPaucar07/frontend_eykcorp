// =========================================================
// RUTAS DEL FEATURE CLIENTES
// =========================================================

export const CLIENTES_ROUTES = [
  {
    path: '',
    name: 'clientes',
    component: () => import('./components/ClientesManagement.vue'),
    meta: { title: 'Clientes' },
  },
]
