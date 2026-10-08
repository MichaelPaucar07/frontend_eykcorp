import { createRouter, createWebHistory } from 'vue-router'

import { CLIENTES_ROUTES } from '@/features/clientes/clientes.routes'
import MainLayout from '@/layout/MainLayout.vue'

// =========================================================
// RUTAS DE LA APLICACIÓN
// =========================================================
// Cada feature define sus propias rutas (<feature>.routes.js) y se
// componen aquí. Los componentes se cargan de forma diferida (lazy loading).

const APP_NAME = 'EYK Corp'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', redirect: '/clientes' },
      { path: 'clientes', children: CLIENTES_ROUTES },
      {
        path: ':pathMatch(.*)*',
        name: 'not-found',
        component: () => import('@/shared/pages/NotFoundPage.vue'),
        meta: { title: 'Página no encontrada' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | ${APP_NAME}` : APP_NAME
})

export default router
