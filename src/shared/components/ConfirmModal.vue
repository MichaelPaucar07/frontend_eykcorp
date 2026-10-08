<script setup>
import BaseModal from '@/shared/components/BaseModal.vue'

// =========================================================
// MODAL DE CONFIRMACIÓN REUTILIZABLE
// =========================================================

defineProps({
  title: { type: String, default: 'Confirmar acción' },
  message: { type: String, required: true },
  confirmText: { type: String, default: 'Confirmar' },
  variant: { type: String, default: 'danger' },
  loading: { type: Boolean, default: false },
})

defineEmits(['confirm', 'cancel'])
</script>

<template>
  <BaseModal :title="title" size="sm" :closable="!loading" @close="$emit('cancel')">
    <p class="mb-0">{{ message }}</p>

    <template #footer>
      <button type="button" class="btn btn-light" :disabled="loading" @click="$emit('cancel')">
        Cancelar
      </button>
      <button
        type="button"
        class="btn"
        :class="`btn-${variant}`"
        :disabled="loading"
        @click="$emit('confirm')"
      >
        <span
          v-if="loading"
          class="spinner-border spinner-border-sm me-1"
          aria-hidden="true"
        ></span>
        {{ confirmText }}
      </button>
    </template>
  </BaseModal>
</template>
