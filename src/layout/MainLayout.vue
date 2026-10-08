<script setup>
import { RouterView } from 'vue-router'

import AppNavbar from '@/shared/components/AppNavbar.vue'
import LoadingBar from '@/shared/components/LoadingBar.vue'
import ToastContainer from '@/shared/components/ToastContainer.vue'

// =========================================================
// LAYOUT PRINCIPAL (shell de la aplicación)
// =========================================================
// Navbar + indicador global de carga + toasts + contenido de la ruta.
</script>

<template>
  <div class="d-flex flex-column min-vh-100 bg-body-tertiary">
    <LoadingBar />
    <AppNavbar />
    <main class="flex-grow-1">
      <RouterView />
    </main>
    <ToastContainer />
  </div>
</template>
