<script setup>
import { formatDateTime, initials } from '@/shared/utils/formatters'
import { formatPhone } from '@/shared/utils/phone'

// =========================================================
// TABLA DE CLIENTES (presentacional: solo muestra y emite eventos)
// =========================================================

defineProps({
  clientes: { type: Array, required: true },
  loading: { type: Boolean, default: false },
})

defineEmits(['edit', 'delete'])
</script>

<template>
  <div class="table-responsive position-relative">
    <!-- Recarga sobre datos existentes: se atenúa la tabla en lugar de vaciarla -->
    <div
      v-if="loading && clientes.length"
      class="table-overlay d-flex align-items-center justify-content-center"
    >
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando</span>
      </div>
    </div>

    <table class="table table-hover align-middle mb-0">
      <thead class="table-light">
        <tr>
          <th scope="col">Cliente</th>
          <th scope="col">Correo</th>
          <th scope="col">Teléfono</th>
          <th scope="col">Fecha de creación</th>
          <th scope="col" class="text-end">Acciones</th>
        </tr>
      </thead>

      <tbody>
        <!-- Primera carga: filas esqueleto -->
        <template v-if="loading && !clientes.length">
          <tr v-for="n in 5" :key="`skeleton-${n}`" class="placeholder-glow">
            <td><span class="placeholder col-8"></span></td>
            <td><span class="placeholder col-10"></span></td>
            <td><span class="placeholder col-6"></span></td>
            <td><span class="placeholder col-7"></span></td>
            <td><span class="placeholder col-4 float-end"></span></td>
          </tr>
        </template>

        <tr v-for="cliente in clientes" v-else :key="cliente.id">
          <td>
            <div class="d-flex align-items-center gap-2">
              <span class="avatar" aria-hidden="true">
                {{ initials(cliente.nombres, cliente.apellidos) }}
              </span>
              <div>
                <div class="fw-medium">{{ cliente.nombres }} {{ cliente.apellidos }}</div>
                <div class="text-secondary small">ID {{ cliente.id }}</div>
              </div>
            </div>
          </td>
          <td>{{ cliente.correo }}</td>
          <td class="text-nowrap">{{ formatPhone(cliente.telefono) }}</td>
          <td class="text-secondary small">{{ formatDateTime(cliente.fechaCreacion) }}</td>
          <td class="text-end text-nowrap">
            <button
              type="button"
              class="btn btn-sm btn-outline-primary me-1"
              :aria-label="`Editar a ${cliente.nombres}`"
              @click="$emit('edit', cliente)"
            >
              <i class="bi bi-pencil"></i>
            </button>
            <button
              type="button"
              class="btn btn-sm btn-outline-danger"
              :aria-label="`Eliminar a ${cliente.nombres}`"
              @click="$emit('delete', cliente)"
            >
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: rgb(255 255 255 / 0.6);
}

.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--bs-primary-bg-subtle);
  color: var(--bs-primary-text-emphasis);
  font-size: 0.8rem;
  font-weight: 600;
}
</style>
