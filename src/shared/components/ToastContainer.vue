<script setup>
import { notifyService } from '@/core/services/ui/notify.service'

// =========================================================
// CONTENEDOR DE TOASTS (equivalente a ngx-toastr)
// =========================================================

const TOAST_STYLES = {
  success: { icon: 'bi-check-circle-fill', color: 'text-success' },
  error: { icon: 'bi-x-circle-fill', color: 'text-danger' },
  info: { icon: 'bi-info-circle-fill', color: 'text-primary' },
  warning: { icon: 'bi-exclamation-triangle-fill', color: 'text-warning' },
}

const { toasts, dismiss } = notifyService
</script>

<template>
  <div class="toast-container position-fixed bottom-0 end-0 p-3" aria-live="polite">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast show border-0 shadow"
        role="alert"
        aria-atomic="true"
      >
        <div class="toast-header">
          <i
            class="bi me-2"
            :class="[TOAST_STYLES[toast.type].icon, TOAST_STYLES[toast.type].color]"
            aria-hidden="true"
          ></i>
          <strong class="me-auto">{{ toast.title }}</strong>
          <button
            type="button"
            class="btn-close"
            aria-label="Cerrar"
            @click="dismiss(toast.id)"
          ></button>
        </div>
        <div class="toast-body">{{ toast.message }}</div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  z-index: 2100;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
