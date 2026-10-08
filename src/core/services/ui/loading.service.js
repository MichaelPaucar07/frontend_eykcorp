import { computed, ref } from 'vue'

// =========================================================
// ESTADO GLOBAL DE CARGA
// =========================================================
// Contador de peticiones HTTP en curso. El loadingInterceptor lo incrementa
// y decrementa; el componente LoadingBar lo observa.

const counter = ref(0)

export const loadingService = {
  isLoading: computed(() => counter.value > 0),

  start() {
    counter.value++
  },

  stop() {
    counter.value = Math.max(0, counter.value - 1)
  },

  reset() {
    counter.value = 0
  },
}
