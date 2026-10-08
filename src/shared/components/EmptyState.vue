<script setup>
// =========================================================
// ESTADO VACÍO / ERROR REUTILIZABLE
// =========================================================

defineProps({
  icon: { type: String, default: 'bi-inbox' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  variant: { type: String, default: 'secondary' }, // 'secondary' | 'danger'
})
</script>

<template>
  <div class="text-center py-5 px-3">
    <i class="bi fs-1 d-block mb-2" :class="[icon, `text-${variant}`]" aria-hidden="true"></i>
    <h6 class="fw-semibold mb-1">{{ title }}</h6>
    <p v-if="description" class="text-secondary small mb-3">{{ description }}</p>
    <slot />
  </div>
</template>
