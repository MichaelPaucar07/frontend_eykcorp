<script setup>
import { computed } from 'vue'

import { findCountry, PHONE_COUNTRIES } from '@/shared/utils/phone'

// =========================================================
// CAMPO DE TELÉFONO CON CÓDIGO DE PAÍS (reutilizable)
// =========================================================
// Uso: <PhoneField v-model:country="form.pais" v-model:number="form.numero" :error="..." />
// Solo acepta dígitos y limita la longitud según el país elegido.

const country = defineModel('country', { type: String, required: true })
const number = defineModel('number', { type: String, default: '' })

defineProps({
  id: { type: String, required: true },
  label: { type: String, default: 'Teléfono' },
  error: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})

const selected = computed(() => findCountry(country.value))

function onNumberInput(event) {
  const digits = event.target.value.replace(/\D/g, '').slice(0, selected.value.digits)
  event.target.value = digits
  number.value = digits
}

function onCountryChange(event) {
  country.value = event.target.value
  number.value = number.value.slice(0, findCountry(event.target.value).digits)
}
</script>

<template>
  <div class="mb-3">
    <label :for="id" class="form-label fw-medium">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>

    <div class="input-group" :class="{ 'has-validation': error }">
      <select
        class="form-select flex-grow-0 w-auto"
        :class="{ 'is-invalid': error }"
        :value="country"
        :disabled="disabled"
        aria-label="Código de país"
        @change="onCountryChange"
      >
        <option v-for="c in PHONE_COUNTRIES" :key="c.iso" :value="c.iso">
          {{ c.iso }} +{{ c.dial }}
        </option>
      </select>
      <input
        :id="id"
        :value="number"
        type="tel"
        inputmode="numeric"
        autocomplete="tel-national"
        class="form-control"
        :class="{ 'is-invalid': error }"
        :placeholder="selected.example"
        :maxlength="selected.digits"
        :disabled="disabled"
        :aria-describedby="`${id}-help`"
        @input="onNumberInput"
      />
      <div v-if="error" class="invalid-feedback">{{ error }}</div>
    </div>

    <div v-if="!error" :id="`${id}-help`" class="form-text">
      {{ selected.name }}: {{ selected.digits }} dígitos, ej. {{ selected.example }}
    </div>
  </div>
</template>
