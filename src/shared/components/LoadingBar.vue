<script setup>
import { loadingService } from '@/core/services/ui/loading.service'

// =========================================================
// INDICADOR GLOBAL DE CARGA
// =========================================================
// Barra fina en la parte superior; se activa sola con cada petición HTTP
// gracias al loadingInterceptor.

const { isLoading } = loadingService
</script>

<template>
  <div
    class="loading-bar"
    :class="{ 'loading-bar--active': isLoading }"
    role="status"
    aria-live="polite"
    :aria-hidden="!isLoading"
  >
    <span class="visually-hidden">Cargando</span>
  </div>
</template>

<style scoped>
.loading-bar {
  position: fixed;
  inset: 0 0 auto 0;
  height: 3px;
  z-index: 2000;
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.loading-bar--active {
  opacity: 1;
}

.loading-bar::after {
  content: '';
  position: absolute;
  inset: 0;
  width: 40%;
  background: var(--bs-primary);
  animation: loading-slide 1.1s ease-in-out infinite;
}

@keyframes loading-slide {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(250%);
  }
}
</style>
