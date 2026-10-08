<script setup>
import { computed, reactive, ref } from 'vue'

import BaseModal from '@/shared/components/BaseModal.vue'
import FormField from '@/shared/components/FormField.vue'
import PhoneField from '@/shared/components/PhoneField.vue'
import {
  CLIENTE_LIMITS,
  emptyClienteForm,
  toClienteForm,
  toClientePayload,
  validateClienteForm,
} from '../models/cliente'
import { clienteService } from '../services/cliente.service'

// =========================================================
// MODAL DE CREAR / EDITAR CLIENTE
// =========================================================
// Sin "cliente" -> crea; con "cliente" -> edita.
// Valida en el cliente antes de enviar y muestra también los errores
// por campo que devuelva el backend (400) y el correo duplicado (409).

const props = defineProps({
  cliente: { type: Object, default: null },
})

const emit = defineEmits(['saved', 'close'])

const isEdit = computed(() => props.cliente !== null)
const form = reactive(isEdit.value ? toClienteForm(props.cliente) : emptyClienteForm())
const errors = ref({})
const saving = ref(false)

// Al escribir en un campo se limpia su error
function clearError(field) {
  if (errors.value[field]) errors.value = { ...errors.value, [field]: '' }
}

async function submit() {
  errors.value = validateClienteForm(form)
  if (Object.keys(errors.value).length) return

  saving.value = true
  try {
    const payload = toClientePayload(form)
    const saved = isEdit.value
      ? await clienteService.actualizar(props.cliente.id, payload)
      : await clienteService.crear(payload)
    emit('saved', saved)
  } catch (error) {
    // El toast ya lo mostró el notifyInterceptor; aquí se marcan los campos
    if (error.status === 400) errors.value = error.errors
    if (error.status === 409) errors.value = { correo: error.message }
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <BaseModal
    :title="isEdit ? 'Editar cliente' : 'Nuevo cliente'"
    :closable="!saving"
    @close="emit('close')"
  >
    <form id="cliente-form" novalidate @submit.prevent="submit">
      <div class="row">
        <div class="col-md-6">
          <FormField
            id="nombres"
            v-model="form.nombres"
            label="Nombres"
            required
            :maxlength="CLIENTE_LIMITS.nombres"
            :error="errors.nombres"
            :disabled="saving"
            @update:model-value="clearError('nombres')"
          />
        </div>
        <div class="col-md-6">
          <FormField
            id="apellidos"
            v-model="form.apellidos"
            label="Apellidos"
            required
            :maxlength="CLIENTE_LIMITS.apellidos"
            :error="errors.apellidos"
            :disabled="saving"
            @update:model-value="clearError('apellidos')"
          />
        </div>
      </div>

      <FormField
        id="correo"
        v-model="form.correo"
        label="Correo"
        type="email"
        placeholder="nombre@correo.com"
        required
        :maxlength="CLIENTE_LIMITS.correo"
        :error="errors.correo"
        :disabled="saving"
        @update:model-value="clearError('correo')"
      />

      <PhoneField
        id="telefono"
        v-model:country="form.telefonoPais"
        v-model:number="form.telefonoNumero"
        label="Teléfono"
        required
        :error="errors.telefono"
        :disabled="saving"
        @update:number="clearError('telefono')"
        @update:country="clearError('telefono')"
      />
    </form>

    <template #footer>
      <button type="button" class="btn btn-light" :disabled="saving" @click="emit('close')">
        Cancelar
      </button>
      <button type="submit" form="cliente-form" class="btn btn-primary" :disabled="saving">
        <span v-if="saving" class="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
        {{ isEdit ? 'Guardar cambios' : 'Crear cliente' }}
      </button>
    </template>
  </BaseModal>
</template>
