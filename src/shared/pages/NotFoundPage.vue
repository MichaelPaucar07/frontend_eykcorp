<script setup>
import { RouterLink } from 'vue-router'

import EmptyState from '@/shared/components/EmptyState.vue'
</script>

<template>
  <div class="container py-5">
    <EmptyState
      icon="bi-signpost-split"
      title="Página no encontrada"
      description="La ruta que buscas no existe."
    >
      <RouterLink to="/" class="btn btn-primary">Volver al inicio</RouterLink>
    </EmptyState>
  </div>
</template>
