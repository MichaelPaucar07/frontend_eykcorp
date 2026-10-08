<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="navbar navbar-expand bg-dark" data-bs-theme="dark">
    <div class="container">
      <RouterLink to="/" class="navbar-brand fw-semibold d-flex align-items-center gap-2">
        <i class="bi bi-people-fill text-primary" aria-hidden="true"></i>
        EYK Corp
      </RouterLink>

      <ul class="navbar-nav">
        <li class="nav-item">
          <RouterLink to="/clientes" class="nav-link" active-class="active">Clientes</RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>
