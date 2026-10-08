<script setup>
import { onMounted, ref } from 'vue'

import { notifyService } from '@/core/services/ui/notify.service'
import ConfirmModal from '@/shared/components/ConfirmModal.vue'
import EmptyState from '@/shared/components/EmptyState.vue'
import PaginationBar from '@/shared/components/PaginationBar.vue'
import { clienteService } from '../services/cliente.service'
import ClienteFormModal from './ClienteFormModal.vue'
import ClienteTable from './ClienteTable.vue'

// =========================================================
// PÁGINA DE GESTIÓN DE CLIENTES (contenedor con estado)
// =========================================================

const DEFAULT_SIZE = 10

/** @type {import('vue').Ref<import('@/core/models/api-response').PageResponse<any>>} */
const pageData = ref({
  content: [],
  page: 0,
  size: DEFAULT_SIZE,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true,
})
const loading = ref(false)
const loadError = ref('')

// Modal de formulario: false = cerrado, null = crear, objeto = editar
const formTarget = ref(false)

const deleteTarget = ref(null)
const deleting = ref(false)

async function loadClientes(
  page = pageData.value.page,
  size = pageData.value.size,
  successMessage,
) {
  loading.value = true
  loadError.value = ''
  try {
    pageData.value = await clienteService.listar(page, size)
    if (successMessage) notifyService.success(successMessage)
  } catch (error) {
    loadError.value = error.message
  } finally {
    loading.value = false
  }
}

function refresh() {
  loadClientes(pageData.value.page, pageData.value.size, 'Lista de clientes actualizada.')
}

function openCreate() {
  formTarget.value = null
}

function openEdit(cliente) {
  formTarget.value = cliente
}

function closeForm() {
  formTarget.value = false
}

function onSaved() {
  const wasCreate = formTarget.value === null
  closeForm()
  // La lista se ordena por id ascendente: un cliente nuevo queda en la última
  // posición, así que se navega a esa página para mostrarlo. Al editar se
  // recarga la página actual.
  const { page, size, totalElements } = pageData.value
  loadClientes(wasCreate ? Math.floor(totalElements / size) : page)
}

async function confirmDelete() {
  deleting.value = true
  try {
    await clienteService.eliminar(deleteTarget.value.id)
    deleteTarget.value = null
    // Si se eliminó el último registro de la página, retroceder una
    const { page, content } = pageData.value
    loadClientes(content.length === 1 && page > 0 ? page - 1 : page)
  } catch {
    // El toast de error ya lo muestra el notifyInterceptor
  } finally {
    deleting.value = false
  }
}

onMounted(() => loadClientes(0, DEFAULT_SIZE))
</script>

<template>
  <div class="container py-4">
    <!-- Encabezado -->
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
      <div>
        <h1 class="h3 fw-semibold mb-1">Clientes</h1>
        <p class="text-secondary mb-0">
          <span class="badge rounded-pill text-bg-light border">
            {{ pageData.totalElements }} registrados
          </span>
        </p>
      </div>

      <div class="d-flex gap-2">
        <button
          type="button"
          class="btn btn-outline-secondary"
          :disabled="loading"
          aria-label="Actualizar lista"
          @click="refresh"
        >
          <i class="bi bi-arrow-clockwise" :class="{ spin: loading }"></i>
        </button>
        <button type="button" class="btn btn-primary" @click="openCreate">
          <i class="bi bi-plus-lg me-1"></i> Nuevo cliente
        </button>
      </div>
    </div>

    <!-- Contenido -->
    <div class="card border-0 shadow-sm">
      <EmptyState
        v-if="loadError && !pageData.content.length"
        icon="bi-wifi-off"
        variant="danger"
        title="No se pudieron cargar los clientes"
        :description="loadError"
      >
        <button type="button" class="btn btn-outline-primary btn-sm" @click="loadClientes()">
          Reintentar
        </button>
      </EmptyState>

      <EmptyState
        v-else-if="!loading && !pageData.content.length"
        icon="bi-people"
        title="Aún no hay clientes"
        description="Registra el primer cliente para empezar."
      >
        <button type="button" class="btn btn-primary btn-sm" @click="openCreate">
          <i class="bi bi-plus-lg me-1"></i> Nuevo cliente
        </button>
      </EmptyState>

      <template v-else>
        <ClienteTable
          :clientes="pageData.content"
          :loading="loading"
          @edit="openEdit"
          @delete="deleteTarget = $event"
        />
        <div class="card-footer bg-white">
          <PaginationBar
            :page="pageData.page"
            :size="pageData.size"
            :total-pages="pageData.totalPages"
            :total-elements="pageData.totalElements"
            :disabled="loading"
            @change-page="loadClientes($event)"
            @change-size="loadClientes(0, $event)"
          />
        </div>
      </template>
    </div>

    <!-- Modales -->
    <ClienteFormModal
      v-if="formTarget !== false"
      :cliente="formTarget"
      @saved="onSaved"
      @close="closeForm"
    />

    <ConfirmModal
      v-if="deleteTarget"
      title="Eliminar cliente"
      :message="`¿Seguro que deseas eliminar a ${deleteTarget.nombres} ${deleteTarget.apellidos}? Esta acción no se puede deshacer.`"
      confirm-text="Eliminar"
      :loading="deleting"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>

<style scoped>
.spin {
  display: inline-block;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
