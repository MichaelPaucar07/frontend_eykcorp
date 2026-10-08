<script setup>
import { computed } from 'vue'

// =========================================================
// PAGINACIÓN REUTILIZABLE
// =========================================================
// Recibe directamente el PageResponse del backend (page, size, totalPages...).
// La página es base 0, igual que en Spring.

const props = defineProps({
  page: { type: Number, required: true },
  size: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  totalElements: { type: Number, required: true },
  sizeOptions: { type: Array, default: () => [5, 10, 20, 50] },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['change-page', 'change-size'])

const MAX_VISIBLE_PAGES = 5

// Ventana de páginas visibles centrada en la actual
const visiblePages = computed(() => {
  const total = props.totalPages
  const half = Math.floor(MAX_VISIBLE_PAGES / 2)
  let start = Math.max(0, props.page - half)
  const end = Math.min(total, start + MAX_VISIBLE_PAGES)
  start = Math.max(0, end - MAX_VISIBLE_PAGES)
  return Array.from({ length: end - start }, (_, i) => start + i)
})

const rangeText = computed(() => {
  if (props.totalElements === 0) return 'Sin registros'
  const from = props.page * props.size + 1
  const to = Math.min((props.page + 1) * props.size, props.totalElements)
  return `${from}–${to} de ${props.totalElements}`
})

function goTo(page) {
  if (props.disabled || page < 0 || page >= props.totalPages || page === props.page) return
  emit('change-page', page)
}
</script>

<template>
  <div class="d-flex flex-column flex-md-row align-items-center justify-content-between gap-2">
    <div class="d-flex align-items-center gap-2 text-secondary small">
      <span>Mostrar</span>
      <select
        class="form-select form-select-sm w-auto"
        :value="size"
        :disabled="disabled"
        aria-label="Registros por página"
        @change="emit('change-size', Number($event.target.value))"
      >
        <option v-for="option in sizeOptions" :key="option" :value="option">{{ option }}</option>
      </select>
      <span>{{ rangeText }}</span>
    </div>

    <nav v-if="totalPages > 1" aria-label="Paginación">
      <ul class="pagination pagination-sm mb-0">
        <li class="page-item" :class="{ disabled: page === 0 || disabled }">
          <button class="page-link" aria-label="Anterior" @click="goTo(page - 1)">
            <i class="bi bi-chevron-left"></i>
          </button>
        </li>
        <li
          v-for="p in visiblePages"
          :key="p"
          class="page-item"
          :class="{ active: p === page, disabled: disabled && p !== page }"
        >
          <button
            class="page-link"
            :aria-current="p === page ? 'page' : undefined"
            @click="goTo(p)"
          >
            {{ p + 1 }}
          </button>
        </li>
        <li class="page-item" :class="{ disabled: page >= totalPages - 1 || disabled }">
          <button class="page-link" aria-label="Siguiente" @click="goTo(page + 1)">
            <i class="bi bi-chevron-right"></i>
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>
