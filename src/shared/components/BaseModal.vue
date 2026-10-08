<script setup>
import { onBeforeUnmount, onMounted } from 'vue'

// =========================================================
// MODAL BASE REUTILIZABLE
// =========================================================
// Convención de modales: cierra con ESC, cierra con clic en el fondo y
// bloquea el scroll del body mientras está abierto.
// Se monta con v-if desde el padre, así cada apertura es una instancia nueva.

const props = defineProps({
  title: { type: String, required: true },
  size: { type: String, default: '' }, // '', 'sm', 'lg'
  closable: { type: Boolean, default: true },
})

const emit = defineEmits(['close'])

function close() {
  if (props.closable) emit('close')
}

function onKeydown(event) {
  if (event.key === 'Escape') close()
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  document.body.style.overflow = 'hidden'
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div class="modal-backdrop fade show"></div>
    <div
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      @mousedown.self="close"
    >
      <div class="modal-dialog modal-dialog-centered" :class="size && `modal-${size}`">
        <div class="modal-content border-0 shadow">
          <div class="modal-header">
            <h5 class="modal-title fw-semibold">{{ title }}</h5>
            <button
              type="button"
              class="btn-close"
              aria-label="Cerrar"
              :disabled="!closable"
              @click="close"
            ></button>
          </div>

          <div class="modal-body">
            <slot />
          </div>

          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
