# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Vue 3 SPA (`frontend_eykcorp`) for the EYK Corp technical test: CRUD of clientes consuming the Spring Boot API in the sibling repo `backend_eykcorp` (`E:\Repositories\Springboot\backend_eykcorp`). JavaScript (no TypeScript), Vite, Vue Router, Axios, Bootstrap 5 + Bootstrap Icons. No Pinia: shared UI state lives in plain reactive modules under `core/services/ui/`.

The folder layout intentionally mirrors the author's Angular projects (`core/`, `features/`, `layout/`, `shared/`, `environments/`), so the same mental model applies.

## Commands

```bash
npm run dev       # http://localhost:5173 (backend expected on http://localhost:8081)
npm run build     # production build -> dist/
npm run lint      # oxlint + eslint (with --fix)
npm run format    # prettier on src/
```

Prettier style: no semicolons, single quotes, 100 cols.

## Architecture (`src/`)

- `environments/environment.js` — reads `VITE_API_URL` (`.env.development` -> `http://localhost:8081`, `.env.production` -> `/api` behind Nginx).
- `core/`
  - `http/http.client.js` — the single Axios instance (`baseURL` from the environment). Interceptors are registered here; order matters (loading first, then notify).
  - `interceptors/loading.interceptor.js` — drives the global `LoadingBar`. Opt out per request with `{ skipGlobalLoading: true }`.
  - `interceptors/notify.interceptor.js` — **every failed request toasts automatically** and is rejected as a normalized `ApiError` `{ status, message, errors }` (never a raw Axios error). Success toasts are **opt-in** per request with `notifySuccess()` / `notifySuccess('msg')`; suppress the error toast with `skipErrorNotify()`.
  - `services/ui/loading.service.js`, `services/ui/notify.service.js` — module-level reactive state (Angular-signal equivalent). Use `notifyService` directly only for UI feedback not tied to an HTTP call.
  - `models/api-response.js` — JSDoc typedefs for the backend contract (`ApiResponse`, `PageResponse`, `ApiError`).
- `features/<name>/` — `<name>.routes.js`, `components/`, `models/`, `services/`.
  - Feature services are **stateless** wrappers around `http` that return `response.data.data`; state lives in the page component.
  - Mutations (`POST`/`PUT`/`DELETE`) always pass `notifySuccess()` so the backend's `message` is toasted — don't add a manual success toast on top.
  - Model files hold JSDoc typedefs, form factories and client-side validation that mirrors the backend rules (the backend always re-validates).
- `layout/MainLayout.vue` — shell: `LoadingBar` + `AppNavbar` + `RouterView` + `ToastContainer`.
- `shared/components/` — reusable, domain-agnostic components (`BaseModal`, `ConfirmModal`, `FormField`, `PaginationBar`, `EmptyState`, `LoadingBar`, `ToastContainer`, `AppNavbar`); `shared/pages/` (404); `shared/utils/` pure helpers.
- `router/index.js` composes feature routes under `MainLayout`; route components are lazy-loaded; `meta.title` sets the document title.

## Backend contract

All responses: `{ success, status, message, data, errors, timestamp }`. `GET /clientes?page=&size=` returns a `PageResponse` in `data` (`content`, `page` 0-based, `size`, `totalElements`, `totalPages`, `first`, `last`). `400` carries per-field `errors`; `409` means duplicated `correo`. `DELETE` returns `200` with a body.

## Component conventions

- Modals use `BaseModal` (Teleport to body, ESC and backdrop `mousedown` close, body scroll lock) and are mounted with `v-if` so each opening is a fresh instance.
- Forms use `FormField` with `v-model` + `:error`; show backend `400` errors per field and map `409` to the `correo` field.
- Loading states: skeleton rows on first load, dimmed overlay on reload, spinner + disabled buttons while saving/deleting.
- Page components own the state (`ref`s); presentational children (e.g. `ClienteTable`) only receive props and emit events.
