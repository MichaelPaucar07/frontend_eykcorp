# Frontend EYK Corp – Gestión de Clientes

SPA en **Vue 3** para la gestión de clientes (listar, crear, editar y eliminar), desarrollada como parte de la prueba técnica para Desarrollador Fullstack de EYK Corp. Consume la API REST del repositorio [backend_eykcorp](https://github.com/MichaelPaucar07/backend_eykcorp).

## Stack tecnológico

| Tecnología | Uso |
|---|---|
| Vue 3 (Composition API, `<script setup>`) | Framework de la SPA |
| Vite | Servidor de desarrollo y build |
| Vue Router | Navegación (rutas por feature con lazy loading) |
| Axios | Consumo de la API REST, con interceptores |
| Bootstrap 5 + Bootstrap Icons | Estilos y componentes de UI |
| ESLint + Oxlint + Prettier | Calidad y formato de código |
| Nginx | Servidor de producción y reverse proxy hacia la API |
| Docker | Imagen multi-stage (Node → Nginx) |

---

## Ejecución

> Las instrucciones paso a paso, con requisitos y solución de problemas, también están en [`INSTRUCCIONES_EJECUCION.txt`](INSTRUCCIONES_EJECUCION.txt).

### Opción 1: aplicación completa con Docker (recomendada)

El `docker-compose.yml` está en el repositorio del backend y levanta **PostgreSQL + backend + este frontend**. Ambos repositorios deben estar en esta estructura:

```
Repositories/
├── Springboot/backend_eykcorp/   ← docker-compose.yml
└── Vue/frontend_eykcorp/         ← este repositorio
```

```bash
cd Repositories/Springboot/backend_eykcorp
cp .env.example .env
docker compose up -d --build
```

La aplicación queda disponible en **http://localhost:3000**.

### Opción 2: modo desarrollo

**Requisitos:** Node.js `^22.18` (o `>=24.12`) y el backend corriendo en `http://localhost:8081` (ver el README del backend).

```bash
npm install
npm run dev
```

La aplicación queda disponible en **http://localhost:5173**.

> El puerto está fijado en `vite.config.js` (`strictPort: true`) porque el backend solo permite CORS desde `http://localhost:5173`. Si el puerto está ocupado, Vite falla con un error en lugar de usar otro puerto.

### Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Sirve localmente el build de producción |
| `npm run lint` | Oxlint + ESLint (con corrección automática) |
| `npm run format` | Formatea `src/` con Prettier |

---

## Variables de entorno

Vite carga el archivo `.env` según el modo. Solo las variables con prefijo `VITE_` llegan al navegador.

| Archivo | `VITE_API_URL` | Cuándo se usa |
|---|---|---|
| `.env.development` | `http://localhost:8081` | `npm run dev` (llama directo al backend) |
| `.env.production` | `/api` | `npm run build` / Docker (Nginx redirige `/api` al backend) |

En el contenedor, la dirección del backend para el reverse proxy se configura con la variable `BACKEND_URL` (por defecto `http://backend:8081`).

---

## Estructura del proyecto

La organización sigue una arquitectura por capas: `core` (infraestructura), `features` (dominio), `layout` y `shared` (reutilizables).

```
src/
├── environments/
│   └── environment.js              # Configuración por entorno (VITE_API_URL)
├── core/
│   ├── http/http.client.js         # Instancia única de Axios + registro de interceptores
│   ├── interceptors/
│   │   ├── loading.interceptor.js  # Enciende/apaga el indicador global de carga
│   │   └── notify.interceptor.js   # Toasts automáticos de error y normalización a ApiError
│   ├── services/ui/
│   │   ├── loading.service.js      # Estado global de carga
│   │   └── notify.service.js       # Estado global de toasts
│   └── models/api-response.js      # Contrato de respuesta del backend (JSDoc)
├── features/
│   └── clientes/
│       ├── clientes.routes.js
│       ├── components/
│       │   ├── ClientesManagement.vue  # Página: estado, paginación y modales
│       │   ├── ClienteTable.vue        # Tabla (presentacional)
│       │   └── ClienteFormModal.vue    # Formulario de crear/editar
│       ├── models/cliente.js           # Typedefs, conversión y validaciones
│       └── services/cliente.service.js # Llamadas HTTP a /clientes (sin estado)
├── layout/
│   └── MainLayout.vue              # Shell: navbar, barra de carga, toasts, contenido
├── shared/
│   ├── components/                 # Componentes reutilizables, sin lógica de dominio
│   │   ├── BaseModal.vue  ConfirmModal.vue  FormField.vue  PhoneField.vue
│   │   ├── PaginationBar.vue  EmptyState.vue  LoadingBar.vue  ToastContainer.vue
│   │   └── AppNavbar.vue
│   ├── pages/NotFoundPage.vue
│   └── utils/
│       ├── formatters.js           # Fechas e iniciales
│       └── phone.js                # Códigos de país y conversión a formato E.164
├── router/index.js                 # Composición de rutas por feature
├── assets/styles/main.css
├── App.vue
└── main.js
```

Archivos de infraestructura:

| Archivo | Descripción |
|---|---|
| `Dockerfile` | Etapa 1: `npm ci` + `npm run build` con Node 22. Etapa 2: Nginx sirviendo `dist/` |
| `nginx.conf` | Plantilla de Nginx: SPA con `try_files`, reverse proxy `/api` → backend, gzip y caché de assets |
| `.dockerignore` | Excluye `node_modules`, `dist`, `.git`, etc. del contexto de build |

---

## Funcionalidades

| Requisito | Implementación |
|---|---|
| Listar clientes | Tabla paginada (tamaño de página configurable: 5, 10, 20, 50) |
| Crear cliente | Modal con formulario y validación |
| Editar cliente | El mismo modal, precargado con los datos del cliente |
| Eliminar cliente | Modal de confirmación con el nombre del cliente |
| Mensajes de error | Toast automático por cada error de la API, errores por campo en el formulario (400) y en el correo (409), y pantalla de error con "Reintentar" si falla la carga |
| Estados de carga | Barra global de carga, filas *skeleton* en la primera carga, tabla atenuada al recargar, y spinner + botones deshabilitados al guardar o eliminar |

### Validaciones del formulario

Se validan en el cliente para dar feedback inmediato, con **las mismas reglas que el backend** (que siempre vuelve a validar):

| Campo | Regla |
|---|---|
| Nombres / Apellidos | Obligatorios, 2–100 caracteres, **solo letras** (tildes y `ñ` incluidas; un espacio, apóstrofo o guion entre palabras) |
| Correo | Obligatorio, formato `usuario@dominio.ext`, máx. 150 caracteres |
| Teléfono | Obligatorio, con **selector de código de país**. Ecuador: 10 dígitos que empiezan con `09` (ej. `0991234567`). Solo se pueden escribir dígitos y la longitud se limita según el país |

El teléfono se envía al backend en formato internacional **E.164** (`0991234567` + Ecuador → `+593991234567`) y se convierte de vuelta al editar.

---

## Consideraciones técnicas

- **Arquitectura por capas**: los servicios de features son **sin estado** (solo envuelven las llamadas HTTP); el estado vive en el componente de página, y los componentes hijos son presentacionales (props + eventos).
- **Interceptores de Axios**:
  - `loading`: contador de peticiones en curso para el indicador global (se puede omitir por petición con `skipGlobalLoading`).
  - `notify`: **todo error muestra un toast automáticamente** con el `message` del backend, y se rechaza como un `ApiError` uniforme `{ status, message, errors }`. Los toasts de éxito son **opt-in** por petición con `notifySuccess()`, y se usan en todas las operaciones de escritura.
- **Estructura única de respuesta**: el backend siempre responde `{ success, status, message, data, errors, timestamp }`, por lo que el manejo de errores es el mismo en toda la app.
- **Componentes reutilizables** en `shared/components`, sin conocimiento del dominio (`BaseModal` se usa en el formulario y en la confirmación; `FormField`, `PhoneField`, `PaginationBar` y `EmptyState` sirven para cualquier entidad).
- **Modales accesibles**: se cierran con ESC o con clic en el fondo, bloquean el scroll del body y se montan con `v-if` (una instancia nueva en cada apertura, sin estado residual).
- **Lazy loading** de las rutas: cada página se descarga solo cuando se visita.
- **Producción con Nginx**:
  - `try_files ... /index.html` permite recargar cualquier ruta de Vue Router sin obtener un 404.
  - El reverse proxy `/api` hace que frontend y API compartan origen, así que **no se necesita CORS** en producción.
  - Los assets con hash se cachean un año (`immutable`) y el `index.html` no se cachea, para que cada despliegue se vea de inmediato.
- **Calidad de código**: ESLint + Oxlint y Prettier (sin punto y coma, comillas simples, 100 columnas).

---

## Autor

Michael Paucar – [GitHub](https://github.com/MichaelPaucar07)
