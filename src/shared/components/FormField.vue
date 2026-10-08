<script setup>
// =========================================================
// CAMPO DE FORMULARIO REUTILIZABLE (label + input + error)
// =========================================================
// Uso: <FormField v-model="form.correo" label="Correo" type="email" :error="errors.correo" />

const model = defineModel({ type: String, default: '' })

defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' },
  maxlength: { type: Number, default: undefined },
  inputmode: { type: String, default: undefined },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})
</script>

<template>
  <div class="mb-3">
    <label :for="id" class="form-label fw-medium">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>
    <input
      :id="id"
      v-model="model"
      :type="type"
      class="form-control"
      :class="{ 'is-invalid': error }"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :inputmode="inputmode"
      :disabled="disabled"
      :aria-describedby="error ? `${id}-error` : undefined"
    />
    <div v-if="error" :id="`${id}-error`" class="invalid-feedback">{{ error }}</div>
  </div>
</template>
